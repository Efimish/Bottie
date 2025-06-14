import { Command } from "../../types";
import queue from "../../queue";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default new Command(
  new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show your server music queue"),
  async (interaction: ChatInputCommandInteraction) => {
    const titles = queue.getQueue(interaction.guildId!).map((t) => t.title);

    await interaction.reply("Queue: " + titles.join(", "));
  }
);
