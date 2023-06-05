const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const replies = ['Yeees', 'Noo', 'Hohoho', 'Auugh'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ben')
        .setDescription('Ask ben a question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('What do you want to ask?')
                .setRequired(true)),

  async execute(interaction) {

    const question = interaction.options.getString('question')

    const reply = replies[Math.floor(Math.random() * replies.length)];

    const image = new AttachmentBuilder(`./src/image/ben/${reply.toLowerCase()}.png`);

    const embed = new EmbedBuilder()
      .setColor('000000')
      .setTitle(`\"${question}\"`)
      .setThumbnail(`attachment://${reply.toLowerCase()}.png`)
      .setDescription(`**${reply}**`)
    
    await interaction.reply({ ephemeral: false, embeds: [embed], files: [image] });
  },
};