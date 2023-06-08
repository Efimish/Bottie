const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lyrics')
		.setDescription('Sends a song lyrics from MusixMatch')
		.addStringOption(option =>
			option.setName('song')
				.setDescription('Which song\'s lyrics?')
				.setRequired(true)),

	async execute(interaction) {

		const { client } = interaction;
		const song = interaction.options.getString('song');
		await interaction.deferReply();

		const results = await client.spotify.tracks.search(song);
		const track = results[0];

		const songTitle = track.name;
		const songAuthor = track.artists[0].name;

		let lyrics
		try {
			const { data: lyricsContent } = await axios.get(`https://lyrist.vercel.app/api/${songTitle}/${songAuthor}`);
			lyrics = lyricsContent.lyrics;
		} catch (error) {
			lyrics = 'No lyrics found for this song';
		}
		if (!lyrics) lyrics = 'No lyrics found for this song';

		const embed = new EmbedBuilder()
			.setColor('18d860')
			.setTitle(`${songTitle}\n${songAuthor}`)
			.setThumbnail(track.album.images[0].url)
			.setDescription(lyrics)
			.setFooter({ text: 'Source: Spotify + MusixMatch', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png' })

		await interaction.editReply({ ephemeral: false, embeds: [embed] });
	},
};