const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unpause')
		.setDescription('Unpauses bot voice playback'),

	async execute(interaction) {

		const { client } = interaction;

		if (!interaction.member.voice.channel) return interaction.reply("You need to be in a VC to use this command")
		await interaction.deferReply()

		connection = client.player.get(interaction.guildId);
		if (!connection) return interaction.editReply("Nothing is currently playing");

		player = connection.player;
		player.unpause();

		return await interaction.editReply("Unpaused!");
	},
};