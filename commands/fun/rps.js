const { SlashCommandBuilder } = require('discord.js');
const hands = ['rock', 'paper', 'scissors'];


module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Plays rock, paper, scissors.'),
	async execute(interaction) {
		const hand = hands[Math.floor(Math.random() * hands.length)];
		await interaction.reply(`I choose ${hand}!`);
	},
};