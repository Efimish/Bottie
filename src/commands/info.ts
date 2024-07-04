import { SlashCommandBuilder, CommandInteraction, Locale, EmbedBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Bot info')
    .setNameLocalization(Locale.Russian, 'инфо')
    .setDescriptionLocalization(Locale.Russian, 'Информация о боте');

const execute = async (interaction: CommandInteraction) => {
    const avatar = interaction.client.user.displayAvatarURL({ size: 256, extension: 'png' })
    const uptime = Math.floor(interaction.client.uptime / 1000);
    const ping = interaction.client.ws.ping;
    const servers = interaction.client.guilds.cache.size;

    const title = interaction.locale === Locale.Russian ? 'Инфо' : 'Info';
    const uptimeText = interaction.locale === Locale.Russian ? 'Аптайм' : 'Uptime';
    const pingText = interaction.locale === Locale.Russian ? 'Пинг' : 'Ping';
    const serversText = interaction.locale === Locale.Russian ? 'Сервера' : 'Servers';

    const embed = new EmbedBuilder()
        .setColor([0, 0, 0])
        .setTitle(title)
        .setThumbnail(avatar)
        .addFields(
            { name: uptimeText, value: `${uptime}secs`, inline: true },
            { name: pingText, value: `${ping}ms`, inline: true },
            { name: serversText, value: `${servers}`, inline: true },
        );

    await interaction.reply({ embeds: [embed] });
}

export default { data, execute };