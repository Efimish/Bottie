import type { Event } from "../types";
import { Client, Events } from "discord.js";
import commands from "../commands";

const event: Event = (client: Client) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = commands.find(
        (c) => c.data.name === interaction.commandName
      );
      if (!command) return;
      command.execute(interaction);
    }
  });
};

export default event;
