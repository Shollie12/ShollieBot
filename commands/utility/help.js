const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends a list of current commands.'),
	async execute(interaction) {
		await interaction.reply({ content: 'Sending you some help! Check your DMs.', ephemeral: true });
		const helpEmbed = new EmbedBuilder()
			.setColor(15452963)
			.setTitle('Sholliebot Commands')
			.setDescription("Learn about all the wonderful commands Sholliebot has to offer!")
			.addFields(
				{ name: '**Utility**', value: "* **help**\nDM's the user a list of commands!\n* **ping**\nPong!\n* **reload (command)**\nReloads a command once edits were made to it.\n* **server**\nGives information about the server.\n* **user**\nGives information about the user."},
				{ name: '**Fun**', value: "* **parrot (message)**\nRepeats *exactly* what you say!\n* **rng**\nReports a random number from 1-100!\n* **rps**\nPlays rock, paper, scissors with the user."},
			)
			.setThumbnail("https://cdn.discordapp.com/attachments/264858097112055808/1267604554581545092/IMG_2867.jpg?ex=66c46afc&is=66c3197c&hm=f328d63652c682f0e0189ed0b090d477164f4d7276de3f7a1a597c1a8d410243&")

		await interaction.member.send({ embeds: [helpEmbed] });
	},
};
//lol
