const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const clientId = '760785413572001803';
const guilds = ['562902230932652032', '872083984807501855', '778617622480027678', '697297156813357116'];

module.exports = (client) => {
    client.handleCommands = async (commandsPath) => {
        const commandFolders = fs.readdirSync(commandsPath);
        client.commandArray = [];
        for (folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder)
			const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
                const filePath = path.join(folderPath, file)
				const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    client.commandArray.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
			}
		}

		const rest = new REST().setToken(process.env.token);

		(async () => {
			try {
				console.log(`Started refreshing ${client.commandArray.length} application (/) commands.`);

				const pr = [];
				for (const guildId of guilds) {
					pr.push(
						rest.put(
							Routes.applicationGuildCommands(clientId, guildId),
							{ body: client.commandArray },
						)
					);
				};
				await Promise.all(pr);

				console.log(`Successfully reloaded ${client.commandArray.length} application (/) commands.`);
			} catch (error) {
				console.error(error);
			}
		})();
	};
};