const { SlashCommandBuilder } = require('discord.js');
const hands = ['rock', 'paper', 'scissors'];
const hand = hands[Math.floor(Math.random() * hands.length)];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('plays rock paper scissors'),
	async execute(interaction) {
		await interaction.reply(`I choose ${hand}!`);
	},
};