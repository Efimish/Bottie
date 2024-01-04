import { Events, Interaction } from 'discord.js';
import { Event } from '../utils/classes';
import { Bot } from '../bot';

export default new Event({
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction, bot: Bot) => {
        if (!interaction.isChatInputCommand()) return;
        const command = bot.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, bot);
        } catch (err) {
            console.error(err);
            if (interaction.replied || interaction.deferred)
                await interaction.editReply({ content: 'There was an error while executing this command!' });
            else
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
})