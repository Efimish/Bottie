import { Command } from '../utils/classes';
import { Bot } from '../bot';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default new Command({
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Copies your message to a specified channel')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Text that will be sent')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Where to send message')),
    
    execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {

        const { client } = interaction;
        const message = interaction.options.getString('message', true);
        const channel = interaction.options.getChannel('channel') || interaction.channel!;
        
        await (channel as any).send(message);
        
        await interaction.reply({
            content: 'Message sent!', ephemeral: true
        });
    }
})