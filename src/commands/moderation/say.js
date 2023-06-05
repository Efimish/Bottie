const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Copies your message to a specified channel')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message to be sent')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to send message to')),

    async execute(interaction) {
        
        const message = interaction.options.getString("message")
        const channel = interaction.options.getChannel("channel") || interaction.channel

        if(!channel.type === ChannelType.GuildText) return await interaction.reply({ content: 'Please select a valid channel', ephemeral: true })

        await channel.send(message);
        await interaction.reply({ content: "Message sent!", ephemeral: true });
	},
};