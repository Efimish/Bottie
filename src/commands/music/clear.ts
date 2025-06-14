import { Command } from "../../types";
import queue from "../../queue";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Locale,
} from "discord.js";

export default new Command(
  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears your server queue")
    .setNameLocalization(Locale.Russian, "очистить")
    .setDescriptionLocalization(Locale.Russian, "Очищает очередь сервера"),
  async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) {
      await interaction.reply("This command can only be used in a server");
      return;
    }
    queue.clearQueue(interaction.guildId!);

    await interaction.reply("Queue cleared successfully");
  }
);
