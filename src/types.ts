import type {
  Client,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

type Event = (client: Client) => void;

class Command {
  constructor(
    readonly data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    readonly execute: (interaction: ChatInputCommandInteraction) => Promise<void>
  ) {}
}

export { Command };
export type { Event };
