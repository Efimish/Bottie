import { Command } from "../../types";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { PlayerSubscription, getVoiceConnection } from "@discordjs/voice";

export default new Command(
  new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes music pleer"),
  async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) {
      await interaction.reply("This command can only be used in a server");
      return;
    }
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      await interaction.reply("I am not connected to a voice channel");
      return;
    }
    const subscription = (connection.state as any)
      .subscription as PlayerSubscription;
    if (!subscription) {
      await interaction.reply("I am not playing any music");
      return;
    }

    const player = subscription.player;
    player.unpause();

    await interaction.reply("Resumed music");
  }
);
