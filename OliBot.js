const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
	intents: [GatewayIntentBits.Guilds,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers],
	partials: [Partials.Channel]
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath).filter(folder => folder != ".DS_Store");

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

/*
Edited out. All comment contents have been moved to events --> messageCreate.js. 
client.on('messageCreate', async (message) => {
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
});
*/

let my_json = {
	name: "oliver",
	class: "wizard",
	max_context_length: 2048,
	max_length: 100,
	prompt: "Niko the kobold stalked carefully down the alley, his small scaly figure obscured by a dusky cloak that fluttered lightly in the cold winter breeze.",
	quiet: false,
	rep_pen: 1.1,
	rep_pen_range: 256,
	rep_pen_slope: 1,
	temperature: 0.5,
	tfs: 1,
	top_a: 0,
	top_k: 100,
	top_p: 0.9,
	typical: 1
}



client.login(token);

