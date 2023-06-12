const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anime')
		.setDescription('Searches for anime on anilibria.tv')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('What to search for')
				.setRequired(true)),

	async execute(interaction) {

		const { client } = interaction;
		const query = interaction.options.getString('query');
		await interaction.deferReply();

		const { data: content } = await axios.get('https://api.anilibria.tv/v3/title/search', {
			params: {
				search: query,
			}
		});

		const animes = content.list;
		if (animes.length === 0) return interaction.editReply("No animes found");
		const anime = animes[0];
		console.log(animes);

		const title = anime.names.ru;
		const desc = anime.description;
		const type = anime.type.full_string;
		const players = anime.player.list;
		let episodes = [];
		for (const [key, value] of Object.entries(players)) {
			let link = '';
			const hls = value.hls;
			if (hls.fhd) link = hls.fhd;
			else if (hls.hd) link = hls.hd;
			else if (hls.sd) link = hls.sd;
			else continue;
			episodes.push(`[${key}](https://anilibria.tv${link})`);
		}
		const times = Math.ceil(episodes.length / 6);
		let fields = [];
		let index = 0;
		while (index < times) {
			index++;
			const text = episodes.slice((index - 1) * 6, index * 6).join(' ');
			if (fields.length < 25) fields.push({ name: 'Watch', value: text, inline: true })
		}

		const embed = new EmbedBuilder()
			.setColor('18d860')
			.setTitle(title)
			.setAuthor({ name: type })
			.setDescription(`${desc}`)
			.addFields(fields)

		await interaction.editReply({ ephemeral: false, embeds: [embed] });
	},
};