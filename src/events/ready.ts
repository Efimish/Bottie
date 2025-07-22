import { Events, REST, Routes } from "discord.js";
import { Event } from "../event.ts";
import { commands } from "../commands";

export default new Event({
  name: Events.ClientReady,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID!),
      {
        body: commands.map((command) => command.data),
      }
    );

    console.log("Commands updated successfully!");
  },
  once: true,
});
