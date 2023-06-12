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

		const results = await client.spotify.tracks.search(song, { limit: 1 });
		if (results.length === 0) return await interaction.editReply("Something went wrong, no tracks found");
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
			.setFooter({ text: 'Spotify + MusixMatch', iconURL: 'https://i.imgur.com/Ro8WpcM.png' })

		await interaction.editReply({ ephemeral: false, embeds: [embed] });
	},
};