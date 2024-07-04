import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { PlayerSubscription, getVoiceConnection } from '@discordjs/voice';

const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses music pleer');

const execute = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) {
        return await interaction.reply('This command can only be used in a server');
    }
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
        return await interaction.reply('I am not connected to a voice channel');
    }
    const subscription = (connection.state as any).subscription as PlayerSubscription | undefined;
    if (!subscription) {
        return await interaction.reply('I am not playing any music');
    }

    const player = subscription.player;
    player.pause();

    interaction.reply('Paused music');
}

export default { data, execute };