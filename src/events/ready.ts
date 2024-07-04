import { Client, Events, ActivityType, REST, Routes } from 'discord.js';
import commands from '../commands';

export default (client: Client) =>
client.once(Events.ClientReady, async client => {
    client.user.setStatus('online');
    client.user.setActivity('you', { type: ActivityType.Listening });
    console.log(`Logged in as ${client.user.tag}`);
    
    const rest = new REST().setToken(process.env.token!);
    const guildIDs = client.guilds.cache.map(guild => guild.id);
    console.log(`Updating ${commands.length} commands on ${guildIDs.length} servers`);
    const botID = client.user.id;
    const commandsData = commands.map(command => command.data);
    try {
        const promises = [];
        for (const guildID of guildIDs) {
            promises.push(
                rest.put(
                    Routes.applicationGuildCommands(botID, guildID),
                    { body: commandsData }
                )
            );
        }
        await Promise.all(promises);
        console.log('Commands updated successfully!');
    } catch (error) {
        console.error(error);
    }
})