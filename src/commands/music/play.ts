import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import database from '../../database';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, PlayerSubscription } from '@discordjs/voice';

const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option => option
        .setName('query')
        .setDescription('What to search for?')
        .setRequired(true)
    );

const execute = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild || !(interaction.member instanceof GuildMember)) {
        return await interaction.reply('This command can only be used in a server');
    }
    await interaction.deferReply();

    const serverId = interaction.guild.id;
    const query = interaction.options.getString('query', true);

    const result = await yts(query);
    const videos = result.videos;
    if (videos.length === 0) {
        return await interaction.editReply('Found no videos');
    }
    const video = videos[0];

    await database.queueItem.create({
        data: {
            serverId,
            link: video.url,
            title: video.title,
            addedBy: interaction.user.id
        }
    });

    const firstSongInQueue = await database.queueItem.findFirst({
        where: {
            serverId
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    if (!firstSongInQueue) {
        return await interaction.editReply('Something went wrong');
    }
    let currentSongID = firstSongInQueue.id;

    let connection = getVoiceConnection(interaction.guild.id);
    if (!connection) connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel!.id,
        guildId: serverId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const subscription = (connection.state as any).subscription as PlayerSubscription | undefined;
    let player = subscription?.player;

    if (!player) {
        player = createAudioPlayer();
        connection.subscribe(player);
        player.on(AudioPlayerStatus.Idle, async () => {
            console.log('Player became idle');
            await database.queueItem.delete({
                where: {
                    id: currentSongID
                }
            });
            const nextSongInQueue = await database.queueItem.findFirst({
                where: {
                    serverId
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            if (!nextSongInQueue) return connection.destroy(); // QUIT
            currentSongID = nextSongInQueue.id;
            const stream = ytdl(nextSongInQueue.link, {
                filter: 'audioonly',
                highWaterMark: 1 << 25
            });
            const resource = createAudioResource(stream);
            player!.play(resource);
            await interaction.channel?.send(`Now playing ${nextSongInQueue.title}`);
        });

        const stream = ytdl(video.url, {
            filter: 'audioonly',
            highWaterMark: 1 << 25
        });
        const resource = createAudioResource(stream);
        player.play(resource);
        
        await interaction.editReply(`Playing ${video.title}`);
    }
    
    await interaction.editReply(`Added ${video.title} to queue`);
}

export default { data, execute };