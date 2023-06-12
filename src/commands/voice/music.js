const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    getVoiceConnection,
    VoiceConnectionStatus,
    AudioPlayerStatus,
    entersState,
} = require('@discordjs/voice');

const yts = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Handles all music commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Plays a video from youtube')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('search query')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Plays a video from youtube, chosen from first five results')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('search query')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription('Shows a music queue for your server'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('Skips current song and plays next one if available'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription('Pauses bot voice playback'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('resume')
                .setDescription('Resumes bot voice playback')),

    async execute(interaction) {

        const { client } = interaction;

        if (!interaction.member.voice.channel) return await interaction.reply("You need to be in a VC to use this command");
        await interaction.deferReply();
        const subcomm = interaction.options.getSubcommand();

        if (['skip', 'pause', 'resume'].includes(subcomm)) {
            const connection = getVoiceConnection(interaction.guild.id);
            if (!connection) return interaction.editReply("I\'m not playing anything!");
            const subscription = connection.state.subscription;
            if (!subscription) return interaction.editReply("I\'m not playing anything!");
            const queue = client.songsQueue.get(interaction.guild.id);
            if (!queue) return interaction.editReply("I\'m not playing anything!");

            const player = subscription.player;
            if (subcomm === 'pause') {
                player.pause();
                return await interaction.editReply("Music paused ⏯");
            } else if (subcomm === 'resume') {
                player.unpause();
                return await interaction.editReply("Music resumed ⏯");
            } else if (subcomm === 'skip') {
                if (queue.length === 0) return interaction.editReply("Nothing to skip!");
                queue.shift();
                if (queue.length > 0) {
                    const stream = ytdl(queue[0].url, {
                        filter: 'audioonly',
                        highWaterMark: 1 << 25
                    });
                    const source = createAudioResource(stream);
                    player.play(source);
                } else {
                    player.stop();
                }
                return await interaction.editReply("Song skipped ⏭");
            }
        } else if (subcomm === 'queue') {
            let queue = client.songsQueue.get(interaction.guild.id);
            if (!queue) return await interaction.editReply("The queue is empty!");
            if (queue.length === 0) return await interaction.editReply("The queue is empty!");

            let desc = '';
            let index = 0;
            for (video of queue) {
                index++;
                desc += `${index}. ${video.title}`;
                if (index !== queue.length) desc += '\n';
            }

            const embed = new EmbedBuilder()
                .setTitle('Music queue')
                .setDescription(desc)

            return await interaction.editReply({ embeds: [embed] })
        } else if (['play', 'search'].includes(subcomm)) {
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
                connection.subscribe(player);

                player.on(AudioPlayerStatus.Idle, async () => {
                    queue.shift();
                    if (queue.length > 0) {
                        const stream = ytdl(queue[0].url, {
                            filter: 'audioonly',
                            highWaterMark: 1 << 25
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
            }

            let queue = client.songsQueue.get(interaction.guild.id);
            if (!queue) {
                client.songsQueue.set(interaction.guild.id, [])
                queue = client.songsQueue.get(interaction.guild.id);
            }

            const searchResult = await yts(query);
            let resultVideo;
            if (subcomm === 'play') {
                resultVideo = searchResult.videos[0];
            } else if (subcomm === 'search') {
                const videos = searchResult.videos.slice(0, 5);
                let desc = ''
                let index = 0;
                for (const video of videos) {
                    index++;
                    desc += `${index}. ${video.title}`
                    if (index !== videos.length) desc += '\n';
                }
                const embed = new EmbedBuilder()
                    .setTitle(`Search results for\n${query}`)
                    .setDescription(desc)

                const button1 = new ButtonBuilder()
                    .setCustomId('playVideo1')
                    .setLabel('1')
                    .setStyle(ButtonStyle.Primary);

                const button2 = new ButtonBuilder()
                    .setCustomId('playVideo2')
                    .setLabel('2')
                    .setStyle(ButtonStyle.Primary);

                const button3 = new ButtonBuilder()
                    .setCustomId('playVideo3')
                    .setLabel('3')
                    .setStyle(ButtonStyle.Primary);

                const button4 = new ButtonBuilder()
                    .setCustomId('playVideo4')
                    .setLabel('4')
                    .setStyle(ButtonStyle.Primary);

                const button5 = new ButtonBuilder()
                    .setCustomId('playVideo5')
                    .setLabel('5')
                    .setStyle(ButtonStyle.Primary);

                const buttonCancel = new ButtonBuilder()
                    .setCustomId('cancelSearch')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary);

                const playVideoRow = new ActionRowBuilder()
                    .addComponents(button1, button2, button3, button4, button5);

                const cancelRow = new ActionRowBuilder()
                    .addComponents(buttonCancel);

                const response = await interaction.editReply({
                    embeds: [embed],
                    components: [playVideoRow, cancelRow],
                });

                const collectorFilter = i => i.user.id === interaction.user.id;

                try {
                    const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                    if (confirmation.customId === 'playVideo1') {
                        resultVideo = videos[0];
                        await confirmation.update({ content: "Playing video #1", components: [] });
                    } else if (confirmation.customId === 'playVideo2') {
                        resultVideo = videos[1];
                        await confirmation.update({ content: "Playing video #2", components: [] });
                    } else if (confirmation.customId === 'playVideo3') {
                        resultVideo = videos[2];
                        await confirmation.update({ content: "Playing video #3", components: [] });
                    } else if (confirmation.customId === 'playVideo4') {
                        resultVideo = videos[3];
                        await confirmation.update({ content: "Playing video #4", components: [] });
                    } else if (confirmation.customId === 'playVideo5') {
                        resultVideo = videos[4];
                        await confirmation.update({ content: "Playing video #5", components: [] });
                    } else if (confirmation.customId === 'cancelSearch') {
                        await confirmation.update({ content: "Search cancelled", components: [] });
                    }
                } catch (e) {
                    await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                }
            }
            if (!resultVideo) return;
            queue.push(resultVideo);

            if (queue.length === 1) {
                const stream = ytdl(resultVideo.url, {
                    filter: 'audioonly',
                    highWaterMark: 1 << 25
                });
                const source = createAudioResource(stream);
                player.play(source);
            }

            const embed = new EmbedBuilder()
                .setTitle(resultVideo.title)
                .setURL(resultVideo.url)
                .setThumbnail(resultVideo.thumbnail)
                .setColor('ff0000')
                .setAuthor({ name: resultVideo.author.name })
                .setFooter({ text: 'YouTube', iconURL: 'https://i.imgur.com/c6RXIEe.png' })
                .addFields(
                    { name: 'Duration', value: resultVideo.duration.timestamp }
                )

            return interaction.editReply({ embeds: [embed] });
        }
    },
};