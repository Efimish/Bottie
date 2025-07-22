import { SlashCommandBuilder } from "discord.js";
import { Command } from "../command.ts";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
});
