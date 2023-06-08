const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Super secret command for testing')
		.addStringOption(option =>
			option.setName('what')
				.setDescription('What to test?')
				.addChoices(
					{ name: 'getConnection', value: 'getConnection' },
					{ name: 'joinVC', value: 'joinVC' },
					{ name: 'createPlayer', value: 'createPlayer' },
					{ name: 'getState', value: 'getState' },
					{ name: 'playSong', value: 'playSong' },
					{ name: 'getSeconds', value: 'getSeconds' },
				)
				.setRequired(true)),

	async execute(interaction) {

		const { client } = interaction;
		const adminIds = process.env.adminids.split(' ');
		if (!adminIds.includes(interaction.user.id)) return interaction.reply({ ephemeral: true, content: 'You can\'t use that!' });
		console.log('testing command executed!');

		const what = interaction.options.getString('what');

		switch (what) {
			case "getConnection": {
				const connection = getVoiceConnection(interaction.guild.id);
				console.log(connection);
				break;
			}
			case "joinVC": {
				const connection = joinVoiceChannel({
					channelId: interaction.member.voice.channel.id,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});
				break;
			}
			case "createPlayer": {
				const connection = getVoiceConnection(interaction.guild.id);
				const player = createAudioPlayer();
				connection.subscribe(player);
				console.log(connection);
				console.log(player);
				break;
			}
			case "getState": {
				const connection = getVoiceConnection(interaction.guild.id);
				console.log(connection.state);
				console.log(connection.state.subscription ? connection.state.subscription.player : 'no player');
				break;
			}
			case "playSong": {
				const connection = getVoiceConnection(interaction.guild.id);
				const player = createAudioPlayer();
				connection.subscribe(player);
				const res = await yts('im boutta bomb this whole mf plane');
				const video = res.videos[0];
				const stream = ytdl(video.url, { filter: 'audioonly' });
				const source = createAudioResource(stream);
				player.play(source);
				console.log(connection);
				console.log(player);
				console.log(connection.state.subscription.player);
				break;
			}
			case "getSeconds": {
				const connection = getVoiceConnection(interaction.guild.id);
				return await interaction.reply({ content: `Current seconds: ${Math.floor(connection.state.subscription.player.playbackDuration / 1000)}` });
				break;
			}
		}


		await interaction.reply({ ephemeral: true, content: 'Something happened, check console!' });
	},
};