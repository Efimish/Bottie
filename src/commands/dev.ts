import { getVoiceConnection } from '@discordjs/voice';
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('dev')
    .setDescription('dev');

const execute = (interaction: CommandInteraction) => {
    if (interaction.user.id !== process.env.owner) return interaction.reply('You can\'t use this');

    const connection = getVoiceConnection(interaction.guildId!);
    console.log(connection);
    interaction.reply('Done');
}

export default { data, execute };
