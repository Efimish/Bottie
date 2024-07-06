import { SlashCommandBuilder, CommandInteraction, Collection } from 'discord.js';
import database from '../../database';

const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show your server music queue');

const execute = async (interaction: CommandInteraction) => {
    const queueRows = await database.queueItem.findMany({
        where: {
            serverId: interaction.guildId!
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    const queue = queueRows.map(r => r.title);

    interaction.reply('Queue: ' + queue.join(', '));
}

export default { data, execute };
