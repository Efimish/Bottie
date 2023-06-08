require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const Spotify = require('spotify-api.js');
const OpenAI = require("openai");

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
	partials: [Partials.Channel]
});

client.version = require(path.join(process.cwd(), 'package.json')).version;
client.commands = new Collection();
client.songsQueue = new Collection();

const functionsPath = path.join(__dirname, 'functions');
const functions = fs.readdirSync(functionsPath).filter(file => file.endsWith(".js"));
const eventsPath = path.join(__dirname, 'events');
const commandsPath = path.join(__dirname, 'commands');

(async () => {
	for (file of functions) {
		filePath = path.join(functionsPath, file);
		require(filePath)(client);
	}

	client.spotify = await Spotify.Client.create({
		refreshToken: true,
		token: {
			clientID: process.env.spotifyid,
			clientSecret: process.env.spotifysecret,
			refreshToken: process.env.spotifyrefresh,
		},
		onRefresh() {
			console.log('Spotify token has been refreshed!');
		}
	})

	const OpenAIconfiguration = new OpenAI.Configuration({
		apiKey: process.env.openai,
	});

	client.openai = new OpenAI.OpenAIApi(OpenAIconfiguration);

	client.handleEvents(eventsPath);
	client.handleCommands(commandsPath);
	// client.handle...

	client.login(process.env.token);
})();