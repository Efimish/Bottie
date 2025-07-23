import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../command.ts";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Replies with information about the bot."),
  async execute(interaction) {
    const avatar = interaction.client.user.displayAvatarURL({
      size: 256,
      extension: "png",
    });
    const uptime = Math.floor(interaction.client.uptime / 1000);
    const ping = interaction.client.ws.ping;
    const servers = interaction.client.guilds.cache.size;

    const embed = new EmbedBuilder()
      .setTitle("Bot Information")
      .setThumbnail(avatar)
      .setFields([
        { name: "Uptime", value: `${uptime} seconds`, inline: true },
        { name: "Ping", value: `${ping} ms`, inline: true },
        { name: "Servers", value: `${servers}`, inline: true },
      ]);

    await interaction.reply({ embeds: [embed] });
  },
});
