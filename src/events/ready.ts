import { Events, ActivityType, REST, Routes } from "discord.js";
import { Event } from "../event.ts";
import { commands } from "../commands";

export default new Event({
  name: Events.ClientReady,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity({
      name: "beep boop",
      type: ActivityType.Custom,
    });

    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

    if (process.env.NODE_ENV === "production") {
      console.log("Registering global commands...");

      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands.map((command) => command.data),
      });

      console.log("Global commands registered successfully!");
    }

    if (process.env.GUILD_ID) {
      console.log("Registering guild commands...");

      await rest.put(
        Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
        {
          body: commands.map((command) => command.data),
        }
      );

      console.log("Guild commands updated successfully!");
    }
  },
  once: true,
});
