import { Client, Events, ActivityType, REST, Routes } from 'discord.js';
import commands from '../commands';

export default (client: Client) =>
client.once(Events.ClientReady, async client => {
    client.user.setStatus('online');
    client.user.setActivity('you', { type: ActivityType.Listening });
    console.log(`Logged in as ${client.user.tag}`);
    
    // We already checked for the existance of token in main.ts
    const rest = new REST().setToken(process.env.token!);
    const botID = client.user.id;
    const guildIDs = client.guilds.cache.map(guild => guild.id);
    const commandsBody = commands.map(command => command.data);
    const promises = guildIDs.map(guildID => rest.put(
        Routes.applicationGuildCommands(botID, guildID),
        { body: commandsBody }
    ));

    console.log(`Updating ${commandsBody.length} commands on ${guildIDs.length} servers`);
    
    try {
        await Promise.all(promises);
        console.log('Commands updated successfully!');
    } catch (error) {
        console.error(error);
    }
})