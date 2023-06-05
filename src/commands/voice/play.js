const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
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

        const query = interaction.options.getString('query')

        // const player = createAudioPlayer();
        
        // connection.subscribe(player)
        

        if (query.startsWith('https://youtu')) {
            return await interaction.editReply({ content: 'for now you cant use a url' })
        } else {
            const res = await yts(query);
            const video = res.videos[0];

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            })

            const player = createAudioPlayer();
            
            const stream = ytdl(video.url, { filter : 'audioonly' });
            const source = createAudioResource(stream);

            player.play(source);

            connection.subscribe(player);
            connection.player = player;

            client.player.set(interaction.guildId, connection);
            
            // player.on("end", end => {
            //     console.log("end");
            // });

            const embed = new EmbedBuilder()
                .setTitle(video.title)
                .setURL(video.url)
                .setThumbnail(video.thumbnail)
                .setAuthor({ name: video.author.name })
                .addFields(
                    { name: 'Duration', value: video.duration.timestamp }
                )
            
            return await interaction.editReply({ embeds: [embed] })
        }


	},
};