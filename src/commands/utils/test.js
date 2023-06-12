const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder
} = require('discord.js');
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
					{ name: 'button', value: 'button' },
					{ name: 'selectMenu', value: 'selectMenu' }
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
				joinVoiceChannel({
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
				return await interaction.reply({ content: `Current seconds: ${connection.state.subscription.player.state.playbackDuration}` });
				break;
			}
			case "button": {
				const button1 = new ButtonBuilder()
					.setCustomId('playVideo1')
					.setLabel('Video 1')
					.setStyle(ButtonStyle.Primary);

				const button2 = new ButtonBuilder()
					.setCustomId('playVideo2')
					.setLabel('Video 2')
					.setStyle(ButtonStyle.Primary);

				const button3 = new ButtonBuilder()
					.setCustomId('playVideo3')
					.setLabel('Video 3')
					.setStyle(ButtonStyle.Primary);

				const button4 = new ButtonBuilder()
					.setCustomId('playVideo4')
					.setLabel('Video 4')
					.setStyle(ButtonStyle.Primary);

				const button5 = new ButtonBuilder()
					.setCustomId('playVideo5')
					.setLabel('Video 5')
					.setStyle(ButtonStyle.Primary);

				const buttonCancel = new ButtonBuilder()
					.setCustomId('cancelSearch')
					.setLabel('Cancel')
					.setStyle(ButtonStyle.Secondary);

				const playVideoRow = new ActionRowBuilder()
					.addComponents(button1, button2, button3, button4, button5);
				
				const cancelRow = new ActionRowBuilder()
					.addComponents(buttonCancel);

				const response = await interaction.reply({
					content: `test text`,
					components: [playVideoRow, cancelRow],
				});

				const collectorFilter = i => i.user.id === interaction.user.id;

				try {
					const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 10000 });

					if (confirmation.customId === 'playVideo1') {
						await confirmation.update({ content: 'Playing video #1', components: [] });
					} else if (confirmation.customId === 'playVideo2') {
						await confirmation.update({ content: 'Playing video #2', components: [] });
					}
				} catch (e) {
					await interaction.editReply({ content: 'Confirmation not received within 10 seconds, cancelling', components: [] });
				}
				break;
			}
			case "selectMenu": {
				const select = new StringSelectMenuBuilder()
					.setCustomId('starter')
					.setPlaceholder('Make a selection!')
					.addOptions(
						new StringSelectMenuOptionBuilder()
							.setLabel('Bulbasaur')
							.setDescription('The dual-type Grass/Poison Seed Pokémon.')
							.setValue('bulbasaur'),
						new StringSelectMenuOptionBuilder()
							.setLabel('Charmander')
							.setDescription('The Fire-type Lizard Pokémon.')
							.setValue('charmander'),
						new StringSelectMenuOptionBuilder()
							.setLabel('Squirtle')
							.setDescription('The Water-type Tiny Turtle Pokémon.')
							.setValue('squirtle'),
					);

				const row = new ActionRowBuilder()
					.addComponents(select);

				return await interaction.reply({
					content: 'Choose your starter!',
					components: [row],
				});
				break;
			}
		}

		if (what === "button") return;
		await interaction.reply({ ephemeral: true, content: 'Something happened, check console!' });
	},
};