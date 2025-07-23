import { SlashCommandBuilder } from "discord.js";
import { Mistral } from "@mistralai/mistralai";
import { Command } from "../command.ts";

const client = new Mistral();

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Replies with a response to your question.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question you want to ask")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

    const question = interaction.options.getString("question");

    const response = await client.chat.complete({
      model: "mistral-medium-latest",
      messages: [
        {
          role: "system",
          content: "Answer in Markdown, but do not use triple backticks (```).",
        },
        { role: "user", content: question },
      ],
    });

    await interaction.editReply(
      response.choices[0]?.message.content?.toString() ?? "Failed to get a response."
    );
  },
});
