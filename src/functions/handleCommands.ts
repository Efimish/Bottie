import { Bot } from '../bot';
import { REST, Routes } from 'discord.js';
import { commands } from '../commands/index';

const botID = process.env.botid!;
const guilds = process.env.guilds!.split(' ');

export default (bot: Bot) => {
    (async () => {
        for (const command of commands)
            bot.commands.set(command.data.name, command);

        const rest = new REST().setToken(process.env.token!);
        
        try {
            console.log(`Started refreshing ${bot.commands.size} application (/) commands...`);
            const promises: Promise<unknown>[] = [];
            for (const guildID of guilds) {
                promises.push(
                    rest.put(
                        Routes.applicationGuildCommands(botID, guildID),
                        { body: bot.commands.map(c => c.data.toJSON()) }
                    )
                );
            }
            await Promise.all(promises);
            console.log(`Successfully refreshed ${bot.commands.size} application (/) commands!`);
        } catch (err) {
            console.error(err);
        }
    })();
}