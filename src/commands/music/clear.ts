import { SlashCommandBuilder, ChatInputCommandInteraction, Locale } from 'discord.js';
import database from '../../database';

const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears your server queue')
    .setNameLocalization(Locale.Russian, 'очистить')
    .setDescriptionLocalization(Locale.Russian, 'Очищает очередь сервера');

const execute = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) {
        return await interaction.reply('This command can only be used in a server');
    }
    await database.queueItem.deleteMany({
        where: {
            serverId: interaction.guild.id
        }
    });

    await interaction.reply('Queue cleared successfully');
}

export default { data, execute };