import { Events, ActivityType } from 'discord.js';
import { Event } from '../utils/classes';
import { Bot } from '../bot';

export default new Event({
    name: Events.ClientReady,
    once: true,
    execute: async (_, bot: Bot) => {
        const user = bot.discord.user!;
        user.setStatus('online');
        user.setActivity('you', { type: ActivityType.Listening });
        console.log(`Ready! Logged in as ${user.tag}`);
    }
});