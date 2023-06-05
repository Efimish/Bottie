require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const Spotify = require('spotify-api.js');

const client = new Client({
     intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
     partials: [Partials.Channel]
});

client.version = require(path.join(process.cwd(), 'package.json')).version;
client.commands = new Collection();
client.player = new Collection();

const functionsPath = path.join(__dirname, 'functions');
const functions = fs.readdirSync(functionsPath).filter(file => file.endsWith(".js"));
const eventsPath = path.join(__dirname, 'events');
const commandsPath = path.join(__dirname, 'commands');

(async () => {
    client.spotify = await Spotify.Client.create({
        refreshToken: true,
        token: {
            clientID: process.env.spotifyid,
            clientSecret: process.env.spotifysecret,
        },
        onRefresh() {
            console.log(`Token has been refreshed. New token: ${client.spotify.token}!`);
        }
    })
    for (file of functions) {
        filePath = path.join(functionsPath, file);
        require(filePath)(client);
    }

    client.handleEvents(eventsPath);
    client.handleCommands(commandsPath);
    // client.handle...

    client.login(process.env.token);
})();