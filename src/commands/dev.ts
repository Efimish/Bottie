import { Command } from "../types";
import { getVoiceConnection } from "@discordjs/voice";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default new Command(
  new SlashCommandBuilder().setName("dev").setDescription("dev"),
  async (interaction: ChatInputCommandInteraction) => {
    if (interaction.user.id !== process.env.owner) {
      await interaction.reply("You can't use this");
      return;
    }

    const connection = getVoiceConnection(interaction.guildId!);
    console.log(connection);
    await interaction.reply("Done");
  }
);
