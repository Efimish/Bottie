import { Events } from "discord.js";
import { Event } from "../event.ts";
import { commands } from "../commands";

export default new Event({
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = commands.find(
      (c) => c.data.name === interaction.commandName
    );

    if (!command) {
      throw new Error(`Command '${interaction.commandName}' not found.`);
    }

    await command.execute(interaction);
  },
});
