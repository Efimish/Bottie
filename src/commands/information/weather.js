const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const axios = require('axios');

function getDirection(dir) {
    if (23 <= dir && dir <= 67) return 'NE'
    else if (68 <= dir && dir <= 112) return 'E'
    else if (113 <= dir && dir <= 157) return 'SE'
    else if (158 <= dir && dir <= 202) return 'S'
    else if (203 <= dir && dir <= 247) return 'SW'
    else if (248 <= dir && dir <= 292) return 'W'
    else if (293 <= dir && dir <= 337) return 'NW'
    else return 'N'
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Shows weather in requested region')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Where to find weather')
                .setRequired(true)),

    async execute(interaction) {

        const loc = interaction.options.getString('location');

        const { data: content } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: process.env.weatherid,
                q: loc,
                units: 'metric'
            }
        });

        if(content.cod === "404") {
            await interaction.reply({ ephemeral: true, content: 'location not found' })
        } else {
            const embed = new EmbedBuilder()
                .setColor('#1680ac')
                .setTitle(`Weather in ${content.name}`)
                .setDescription(`**${content.weather[0].main}**`)
                .addFields(
                    { name: 'Temperature', value: `${content.main.temp}°C`, inline: true},
                    { name: 'Feels like', value: `${content.main.feels_like}°C`, inline: true },
                    { name: 'Timezone', value: `UTC${content.timezone / 3600}`, inline: true },
                    { name: 'Wind (M/S)', value: `${content.wind.speed} ${getDirection(content.wind.deg)}`, inline: true },
                    { name: 'Humidity', value: `${content.main.humidity}%`, inline: true },
                    { name: 'Visibility', value: `${content.visibility / 1000} km`, inline: true },
                )
                .setTimestamp()
            
            await interaction.reply({ ephemeral: false, embeds: [embed] });
        }
    },
};