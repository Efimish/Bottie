import type {
  CommandInteraction,
  SharedSlashCommand,
} from "discord.js";

interface CommandOptions<T extends SharedSlashCommand> {
  data: T;
  execute(interaction: CommandInteraction): Promise<void>;
}

export class Command<T extends SharedSlashCommand> {
  readonly data: T;
  readonly execute: (interaction: CommandInteraction) => Promise<void>;

  constructor({ data, execute }: CommandOptions<T>) {
    this.data = data;
    this.execute = execute;
  }
}
