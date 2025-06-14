import { Command } from "../../types";
import queue from "../../queue";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  getVoiceConnection,
  PlayerSubscription,
} from "@discordjs/voice";

export default new Command(
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("What to search for?")
        .setRequired(true)
    ),
  async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild || !(interaction.member instanceof GuildMember)) {
      await interaction.reply("This command can only be used in a server");
      return;
    }
    await interaction.deferReply();

    const serverId = interaction.guild.id;
    const query = interaction.options.getString("query", true);

    const result = await yts(query);
    const videos = result.videos;
    if (videos.length === 0) {
      await interaction.editReply("Found no videos");
      return;
    }
    const video = videos[0]!;

    queue.addItem(serverId, {
      title: video.title,
      url: video.url,
    });

    const firstSongInQueue = queue.getQueue(serverId)[0];
    if (!firstSongInQueue) {
      await interaction.editReply("Something went wrong");
      return;
    }

    let connection = getVoiceConnection(interaction.guild.id);
    if (!connection)
      connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel!.id,
        guildId: serverId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

    const subscription = (connection.state as any).subscription as
      | PlayerSubscription
      | undefined;
    let player = subscription?.player;

    if (!player) {
      player = createAudioPlayer();
      connection.subscribe(player);
      player.on(AudioPlayerStatus.Idle, async () => {
        console.log("Player became idle");
        queue.skipItem(serverId);
        const nextSongInQueue = queue.getQueue(serverId)[0];
        if (!nextSongInQueue) return connection.destroy(); // QUIT
        const stream = ytdl(nextSongInQueue.url, {
          filter: "audioonly",
          highWaterMark: 1 << 25,
        });
        const resource = createAudioResource(stream);
        player!.play(resource);
        interaction.channel?.isSendable() &&
          (await interaction.channel.send(
            `Now playing ${nextSongInQueue.title}`
          ));
      });

      const stream = ytdl(video.url, {
        filter: "audioonly",
        highWaterMark: 1 << 25,
      });
      const resource = createAudioResource(stream);
      player.play(resource);

      await interaction.editReply(`Playing ${video.title}`);
    }

    await interaction.editReply(`Added ${video.title} to queue`);
  }
);
