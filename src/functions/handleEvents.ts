import { Events } from 'discord.js';
import { Bot } from '../bot';
import { events } from '../events/index';

export default (bot: Bot) => {
    for (const event of events) {
        if (event.once) {
            bot.discord.once(event.name, (...args) => event.execute(bot, ...args));
        } else {
            bot.discord.on(event.name, (...args) => event.execute(bot, ...args));
        }
    }
}