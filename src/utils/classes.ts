import { SlashCommandBuilder, ClientEvents } from 'discord.js';
import { Bot } from '../bot';

export class Event {
    public readonly name: keyof ClientEvents;
    public readonly once: boolean;
    public readonly execute: (bot: Bot, ...args: any[]) => Promise<void>;
    constructor(params: {
        name: keyof ClientEvents,
        once: boolean,
        execute: (bot: Bot, ...args: any[]) => Promise<void>
    }) {
        this.name = params.name;
        this.once = params.once;
        this.execute = params.execute;
    }
}

export class Command {
    public readonly data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    public readonly execute: (...args: any[]) => Promise<void>
    constructor(params: {
        data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
        execute: (...args: any[]) => Promise<void>
    }) {
        this.data = params.data;
        this.execute = params.execute;
    }
}