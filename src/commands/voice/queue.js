const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Shows a music queue for your server'),

	async execute(interaction) {

		const { client } = interaction;

		if (!interaction.member.voice.channel) return interaction.reply("You need to be in a VC to use this command");

        let queue = client.songsQueue.get(interaction.guild.id);

		if (!queue) return interaction.reply("There is no queue!");
        if (queue.length === 0) return interaction.reply("The queue is empty!");

        let index = 0;
        let desc = '';
        for (video of queue) {
            index++;
            desc += `${index}. ${video.title}${index !== queue.length ? '\n' : ''}`
        }

		const embed = new EmbedBuilder()
			.setTitle('Music queue')
            .setDescription(desc)

		return await interaction.reply({ embeds: [embed] })

	},
};