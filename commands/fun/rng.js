const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rng')
		.setDescription('Replies with a number 1 - 100'),
	async execute(interaction) {
        axios.get('http://www.randomnumberapi.com/api/v1.0/random?min=1&max=100&count=1')
.then(await function (response) {
    // handle success
    interaction.reply(`${response.data[0]}`);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

	},
};

