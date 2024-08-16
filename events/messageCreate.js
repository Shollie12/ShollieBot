const { Events } = require('discord.js');
const { prefix } = require('./config.json');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		console.log("I hear you")
		// Ignore messages from the bot itself
		if (message.author.bot) return;

		// Log the message content to the console
		console.log(`Message received: ${message.content}`);

		// Respond to specific messages
		if (message.content.includes("<@1268359806083792958>")) {
			message.content = message.content.replace(/<@\d+>/g, "")
			message.reply(`yeah, yeah, yeah, I hear you... ${message.content} or whatever...`);
		}

		// Respond to commands if using the prefix, takes command up to the next space character
		if (!message.toString().startsWith(prefix)) return;

		let endCommandIndex = message.content.indexOf(' ');
		if(endCommandIndex == -1) endCommandIndex = message.length;

		const cmdstr = message.toString().substring(1, endCommandIndex);
		const command = message.client.commands.get(cmdstr);

		if (!command) {
			console.error(`No command matching ${cmdstr} was found.`);
			return;
		}

		try {
			await command.execute(message);
		} catch (error) {
			console.error(error);
			message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
