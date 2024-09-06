/*
The 'rng' command sends an HTTP request to www.randomnumberapi.com
and recieves a random number from 1 - 100 and sends it to the chat.
*/
const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rng')
		.setDescription('Replies with a number! Default: 1 - 100')
    .addIntegerOption(option =>
      option
            .setName(`maximum`)
            .setDescription(`Set the maximum value for your random number.`)
    ),
	async execute(interaction, maximumOption) {
    let maximum = 100;
    if(maximumOption) {
      maximum = maximumOption;
    } else if(interaction.options.getInteger(`maximum`)){
      maximum = interaction.options.getInteger(`maximum`);
    }
    
    if(maximum <= 1){
      interaction.reply(`Please enter a number greater than one!`);
    } else {
      axios.get(`http://www.randomnumberapi.com/api/v1.0/random?min=1&max=${maximum}&count=1`)
        .then(await function (response) {
          // handle success
          interaction.reply(`${response.data[0]}`);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
	},
};

