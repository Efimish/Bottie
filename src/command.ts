import type { SlashCommandBuilder, CommandInteraction } from "discord.js";

interface CommandOptions {
  data: SlashCommandBuilder;
  execute(interaction: CommandInteraction): Promise<void>;
}

export class Command {
  readonly data: SlashCommandBuilder;
  readonly execute: (interaction: CommandInteraction) => Promise<void>;

  constructor({ data, execute }: CommandOptions) {
    this.data = data;
    this.execute = execute;
  }
}
