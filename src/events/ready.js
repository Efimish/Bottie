const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        client.user.setStatus('online');
        client.user.setActivity('you', { type: ActivityType.Listening });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};