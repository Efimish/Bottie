import { Client, Events, SlashCommandBuilder, Interaction, ClientEvents } from 'discord.js';

export class Event {
    public readonly name: keyof ClientEvents;
    public readonly once: boolean;
    public readonly execute: (...args: any[]) => Promise<void>;
    constructor(params: {
        name: keyof ClientEvents,
        once: boolean,
        execute: (...args: any[]) => Promise<void>
    }) {
        this.name = params.name;
        this.once = params.once;
        this.execute = params.execute;
    }
}

export class Command {
    public readonly data: SlashCommandBuilder | any;
    public readonly execute: (...args: any[]) => Promise<void>
    constructor(params: {
        data: SlashCommandBuilder | any,
        execute: (...args: any[]) => Promise<void>
    }) {
        this.data = params.data;
        this.execute = params.execute;
    }
}

// export class Event {
//     constructor(
//         public readonly name: Events,
//         public readonly once: boolean,
//         public readonly execute: (discord: Client) => void
//     ) {}
// }