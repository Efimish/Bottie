const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a youtube video in a voice channel')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('search query')
				.setRequired(true)),

	async execute(interaction) {

		const { client } = interaction;

		if (!interaction.member.voice.channel) return interaction.reply("You need to be in a VC to use this command")
		await interaction.deferReply()

		const query = interaction.options.getString('query');

		let connection = getVoiceConnection(interaction.guild.id);
		if (!connection) connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		let player;
		const subscription = connection.state.subscription;
		if (subscription) {
			player = subscription.player;
		} else {
			player = createAudioPlayer();
		}

		let queue = client.songsQueue.get(interaction.guild.id);
		if (!queue) {
			client.songsQueue.set(interaction.guild.id, [])
			queue = client.songsQueue.get(interaction.guild.id);
		};

		const res = await yts(query);
		const video = res.videos[0];
		queue.push(video)

		if (queue.length === 1) {
			const stream = ytdl(video.url, { 
				filter: 'audioonly',
				highWaterMark: 1<<25
			});
			const source = createAudioResource(stream);
			player.play(source);
			connection.subscribe(player);
		}

		player.on(AudioPlayerStatus.Idle, async () => {
			console.log('Player is IDLE!');
			queue.shift();
			if (queue.length > 0) {
				const stream = ytdl(queue[0].url, { 
					filter: 'audioonly',
					highWaterMark: 1<<25
				});
				const source = createAudioResource(stream);
				player.play(source);
				try {
					await entersState(player, AudioPlayerStatus.Playing, 5000);
				} catch (err) {
					console.error(err);
				}
			}
		});

		const embed = new EmbedBuilder()
			.setTitle(video.title)
			.setURL(video.url)
			.setThumbnail(video.thumbnail)
			.setAuthor({ name: video.author.name })
			.addFields(
				{ name: 'Duration', value: video.duration.timestamp }
			)

		return await interaction.editReply({ embeds: [embed] })

	},
};