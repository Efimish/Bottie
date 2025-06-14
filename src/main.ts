import { Client, GatewayIntentBits, Partials } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  partials: [Partials.Channel],
});

const token = process.env.token;
if (!token) {
  console.log("Specify your token in .env file (token=ABC...)");
  process.exit(1);
}

client.login(token);

import events from "./events";
events.forEach((event) => event(client));
