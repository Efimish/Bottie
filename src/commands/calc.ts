import { Command } from '../utils/classes';
import { Bot } from '../bot';
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import math from 'mathjs';

export default new Command({
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Calculates a mathematical question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Math question')
                .setRequired(true)),
    
    execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {

        const question = interaction.options.getString('question', true);
        
        let res;
        try {
            res = math.evaluate(question);
        } catch (err) {
            await interaction.reply({ content: 'Please, provide a **valid** question', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#808080')
            .setTitle('Calculator')
            .addFields(
                { name: 'Question', value: '```css\n' + question + '```' },
                { name: 'Answer', value: '```css\n' + res + '```' }
            );
        
        await interaction.reply({
            embeds: [embed], ephemeral: true
        });
    }
})