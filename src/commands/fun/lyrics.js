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

    const song = interaction.options.getString('song')

    await interaction.deferReply()

    //client.spotify.tracks.get

    const { data: content } = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: 'Bearer ' + client.spotify.token},
      params: {
        q: song,
        type: 'track',
        limit: 1
      }
    });
    console.log(content)

    const songTitle = content.tracks.items[0].name;
    const songAuthor = content.tracks.items[0].artists[0].name;

    let lyrics
    try {
      const { data: lyriccontent } = await axios.get(`https://lyrist.vercel.app/api/${songTitle}/${songAuthor}`)
      lyrics = lyriccontent.lyrics
    } catch (error) {
      lyrics = 'No lyrics found for this song'
    } 

    //console.log(lyriccontent.error)

    const embed = new EmbedBuilder()
        .setColor('18d860')
        .setTitle(`${songTitle}\n${songAuthor}`)
        .setThumbnail(content.tracks.items[0].album.images[1].url)
        .setDescription(lyrics)
        .setFooter({ text: 'Source: Spotify + MusixMatch', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png' })

    await interaction.editReply({ ephemeral: false, embeds: [embed] });
  },
};