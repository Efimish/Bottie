import { Client, GatewayIntentBits, REST, Routes } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.login(process.env.DISCORD_TOKEN);

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

client.once("ready", async (client) => {
  console.log(`Logged in as ${client.user.tag}`);

  await Promise.all(
    client.guilds.cache.map((guild) => {
      console.log(`Deleting commands for guild: ${guild.name}`);
      return rest.put(
        Routes.applicationGuildCommands(client.user.id, guild.id),
        {
          body: [],
        }
      );
    })
  );

  console.log("All guild commands deleted successfully!");
  process.exit(0);
});
