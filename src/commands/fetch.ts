import { Command } from '../utils/classes';
import { Bot } from '../bot';
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export default new Command({
    data: new SlashCommandBuilder()
        .setName('fetch')
        .setDescription('Shows bot info'),
    
    execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {

        const { client } = interaction;
        const botAvatar = client.user.displayAvatarURL({ size: 256, extension: 'png' });

        const f = Math.floor;
        const uptime = f(client.uptime / 1000); // in seconds
        const days = f(uptime / 86400);
        const hrs = f((uptime % 86400) / 3600);
        const mins = f((uptime % 3600) / 60);
        const secs = uptime % 60;

        const addS = (text: string, value: number) => {
            if (value === 0) return '';
            if (value === 11) return `${value} ${text}s`;
            if (value % 10 === 1) return `${value} ${text}`;
            return `${value} ${text}s`;
        }
        const uptimeText = [addS('day', days), addS('hour', hrs), addS('minute', mins), addS('second', secs)].filter(x => x.length > 0).join(': ');
        const pingText = `${client.ws.ping}ms`;
        const commandsText = String(bot.commands.size);
        const serversText = String(client.guilds.cache.size);

        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle(client.user.username)
            .setThumbnail(botAvatar)
            .addFields(
                { name: 'Uptime', value: uptimeText, inline: true },
                { name: 'Ping', value: pingText, inline: true },
                { name: 'Commands', value: commandsText, inline: true },
                { name: 'Servers', value: serversText, inline: true }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed], ephemeral: true
        });
    }
})