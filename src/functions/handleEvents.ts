import { Bot } from '../bot';
import { events } from '../events/index';

export default (bot: Bot) => {
    for (const event of events) {
        if (event.once) {
            bot.discord.once(event.name, (...args) => event.execute(...args, bot));
        } else {
            bot.discord.on(event.name, (...args) => event.execute(...args, bot));
        }
    }
}