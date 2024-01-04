import { Command } from '../utils/classes';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default new Command({
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('says pong'),
    
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply({ content: 'PONG!' });
    }
})