/*
The 'rps' command plays a basic game of rock paper scissors with
the user.
*/
const { SlashCommandBuilder } = require('discord.js');
const hands = ['rock', 'paper', 'scissors'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Plays rock, paper, scissors.')
			.addStringOption(option =>
				option
					.setName(`choice`)
					.setDescription(`Choose either rock, paper, or scissors.`)
					.setRequired(true)),
	async execute(interaction, choiceOption) {
		let choice = choiceOption;
		if(!choiceOption) {
			choice = interaction.options.getString(`choice`, true);
		}
		choice = choice.toLowerCase().trim();
		const hand = hands[Math.floor(Math.random() * hands.length)];
		let result = `unknown`;

		switch(choice){
			case hand:
				result = `tie`;
				break;
			case `rock`:
				switch(hand){
					case `paper`:
						result = `lose`;
						break;
					case `scissors`:
						result = `win`;
						break;
				}
				break;
			case `paper`:
				switch(hand){
					case `scissors`:
						result = `lose`;
						break;
					case `rock`:
						result = `win`;
						break;
				}
				break;
			case `scissors`:
				switch(hand){
					case `rock`:
						result = `lose`;
						break;
					case `paper`:
						result = `win`;
						break;
				}
				break;
			default:
				result = `unknown`;
				break;
		}

		switch(result){
			case `unknown`:
				await interaction.reply(`You chose ${choice} and I choose ${hand}! :thinking: I'm not sure who wins here...`);
				break;
			case `win`:
				await interaction.reply(`You chose ${choice} and I choose ${hand}! :tada: You win! :tada:`);
				break;
			case `lose`:
				await interaction.reply(`You chose ${choice} and I choose ${hand}! You lose.`);
				break;
			case `tie`:
				await interaction.reply(`You chose ${choice} and I choose ${hand}! We tied!`);
				break;
			default:
				await interaction.reply(`There was an error running this command.`);
				break;
		}	
	},
};