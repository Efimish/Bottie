const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const math = require('mathjs');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('calc')
		.setDescription('Calculates a mathematical question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Math question')
                .setRequired(true)),

    async execute(interaction) {
        
        const question = interaction.options.getString("question")

        let resp;

        try {
            resp = math.evaluate(question)
        } catch (e) {
            return await interaction.reply({ content: 'Please provide a **valid** question', ephemeral: true })
        }

        const embed = new EmbedBuilder()
            .setColor('808080')
            .setTitle('Calculator')
            .addFields(
                { name: 'Question', value: `\`\`\`css\n${question}\`\`\``},
                { name: 'Answer', value: `\`\`\`css\n${resp}\`\`\``}
            )

            await interaction.reply({ ephemeral: true, embeds: [embed] });
	},
};