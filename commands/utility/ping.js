const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pig')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pog!');
	},
};
//lol
