import { Command } from '../utils/classes';
import { Bot } from '../bot';
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import axios from 'axios';

const getDirection = (dir: number) => {
    if (23 <= dir && dir <= 67) return 'NE';
    else if (68 <= dir && dir <= 112) return 'E';
    else if (113 <= dir && dir <= 157) return 'SE';
    else if (158 <= dir && dir <= 202) return 'S';
    else if (203 <= dir && dir <= 247) return 'SW';
    else if (248 <= dir && dir <= 292) return 'W';
    else if (293 <= dir && dir <= 337) return 'NW';
    else return 'N';
}

export default new Command({
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Shows weather in requested region')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Region')
                .setRequired(true)),
    
    execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {

        const location = interaction.options.getString('location', true);
        
        const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: process.env.weather!,
                q: location,
                units: 'metric'
            }
        });
        if (data.cod === '404') {
            await interaction.reply({ content: 'Region not found', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#1680ac')
            .setTitle(`Weather in ${data.name}`)
            .setDescription(`**${data.weather[0].main}**`)
            .addFields(
                { name: 'Temperature', value: `${data.main.temp}°C`, inline: true },
                { name: 'Feels like', value: `${data.main.feels_like}°C`, inline: true },
                { name: 'Timezone', value: `UTC${data.main.timezone / 3600}`, inline: true },
                { name: 'Wind (M/S)', value: `${data.main.wind.speed} ${getDirection(data.wind.deg)}`, inline: true },
                { name: 'Humidity', value: `${data.main.humidity}%`, inline: true },
                { name: 'Visibility', value: `${data.main.visibility / 1000} km`, inline: true }
            );
        
        await interaction.reply({
            embeds: [embed], ephemeral: true
        });
    }
})