const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gpt')
		.setDescription('Ask ChatGPT a question')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('What do you want to ask?')
				.setRequired(true)),

	async execute(interaction) {

		const { client } = interaction;
		const question = interaction.options.getString('question');
		const displayQuestion = question.length > 253 ? question.slice(0, 253) + '...' : question;
		await interaction.deferReply()

		const response = await client.openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: question }],
		});

		console.log(response);
		answer = response.data.choices[0].message.content;

		const embed = new EmbedBuilder()
			.setColor('75a99c')
			.setTitle(displayQuestion)
			.setDescription(answer)
			.setFooter({ text: 'GPT 3.5', iconURL: 'https://i.imgur.com/lLt2BlL.png' })

		await interaction.editReply({ ephemeral: false, embeds: [embed] });
	},
};