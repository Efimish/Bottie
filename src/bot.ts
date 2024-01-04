import 'dotenv/config';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import handleEvents from './functions/handleEvents';
import handleCommands from './functions/handleCommands';
import { Command } from './utils/classes';

export class Bot {
    public readonly discord: Client;
    public readonly commands: Collection<string, Command>;
    constructor() {
        this.discord = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
            partials: [Partials.Channel]
        });
        this.commands = new Collection();
    }
}
const bot = new Bot();

handleEvents(bot);
handleCommands(bot);
bot.discord.login(process.env.token!);