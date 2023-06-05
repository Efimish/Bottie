const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch')
        .setDescription('Shows info about bot'),

    async execute(interaction) {

        const { client } = interaction;

        const botAvatar = client.user.displayAvatarURL({ size: 256, format: "png" });

        const totalSeconds = (client.uptime / 1000);
        const secs = Math.floor(totalSeconds) % 60;
        const mins = Math.floor(totalSeconds / 60) % 60;
        const hrs = Math.floor(totalSeconds / 3600) % 24;
        const days = Math.floor(totalSeconds / 86400);

        const daysText = days > 0 ? (days > 1 ? `${days} days, ` : `${days} day, `) : '';
        const hrsText = hrs > 0 ? (hrs > 1 ? `${hrs} hrs, ` : `${hrs} hr, `) : '';
        const minsText = mins > 0 ? (mins > 1 ? `${mins} mins, ` : `${mins} min, `) : '';
        const secsText = secs > 0 ? (secs > 1 ? `${secs} secs` : `${secs} sec`) : '';

        const uptimeText = `${daysText}${hrsText}${minsText}${secsText}`;
        const pingText = `${client.ws.ping}ms`;
        const commandsText = `${client.commandArray.length}`;
        const serversText = `${client.guilds.cache.size}`

        const embed = new EmbedBuilder()
            .setColor(000000)
            .setTitle('Bottie')
            .setThumbnail(botAvatar)
            .addFields(
                { name: 'Version', value: client.version, inline: true},
                { name: 'Uptime', value: uptimeText, inline: true },
                { name: 'Ping', value: pingText, inline: true },
                { name: 'Commands', value: commandsText, inline: true },
            )
            .setTimestamp()

        await interaction.reply({ ephemeral: false, embeds: [embed] });
    },
};