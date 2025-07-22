import { Client, GatewayIntentBits } from "discord.js";

import { events } from "./events";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

events.forEach((event) => {
  if (event.once) {
    // @ts-ignore
    client.once(event.name, async (...args) => await event.execute(...args));
  } else {
    // @ts-ignore
    client.on(event.name, async (...args) => await event.execute(...args));
  }
});

client.login(process.env.DISCORD_TOKEN);
