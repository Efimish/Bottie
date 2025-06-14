import { Command } from "../types";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Locale,
} from "discord.js";

export default new Command(
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .setNameLocalization(Locale.Russian, "пинг")
    .setDescriptionLocalization(Locale.Russian, "Отвечает Понг!"),
  async (interaction: ChatInputCommandInteraction) => {
    if (interaction.locale === Locale.Russian) {
      await interaction.reply("Понг!");
      return;
    }
    await interaction.reply("Pong!");
  }
);
