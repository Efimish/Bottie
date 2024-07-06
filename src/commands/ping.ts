import { SlashCommandBuilder, CommandInteraction, Locale } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .setNameLocalization(Locale.Russian, 'пинг')
    .setDescriptionLocalization(Locale.Russian, 'Отвечает Понг!');

const execute = (interaction: CommandInteraction) => {
    if (interaction.locale === Locale.Russian) {
        interaction.reply('Понг!');
        return;
    }
    interaction.reply('Pong!');
}

export default { data, execute };
