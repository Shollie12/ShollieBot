/*
The 'gpt' command sends an HTTP request to http://localhost:5001/api/v1/generate
once koboldcpp is running and responds with an AI generated response.
*/
const { SlashCommandBuilder } = require('discord.js');
const { clientId } = require('../../config.json');
const path = require('path');
const axios = require('axios');

//Connect to database
const pathToFolder = path.join(__dirname, '../../db');
const db = require('diskdb');
db.connect(pathToFolder, ['messages']);

// Edit options for the generated response.
const cppconfig = require('./cppconfig.json')
  
module.exports = {
  data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription(`Interact with the bot's generative capabilities.`)
    .addStringOption(option =>
      option
        .setName('prompt')
        .setDescription('The prompt to be sent to the bot.')
        .setRequired(true)),
  async execute(interaction, prompt) {
    // Chat command support
    let userprompt;
    if(!prompt){
      userprompt = interaction.options.getString('prompt', true);
    } else {
      userprompt = prompt;
    }

    //Add user's message to the database
    const usermessage = {
      text: userprompt,
      isUser: true,
      userID: interaction.member.id,
      timestamp: interaction.createdTimestamp,
      sessionID: interaction.channel.id,
    };
    db.messages.save(usermessage);

    let thinkMessage;
    if(!prompt){
      await interaction.deferReply();
    } else {
      thinkMessage = await interaction.channel.send(`:thinking: Thinking...`);
    }
    
    cppconfig.prompt = userprompt;
    await axios.post(`http://localhost:5001/api/v1/generate`, cppconfig)
      .then(async function (response) {
        // Clean text and print raw text.
        const rawText = response.data.results[0].text;
        console.log(`\nThis is the raw text: ${rawText.replace(/\n/g, `\\n`).replace(/\r/g, `\\r`)}`);
        const cleanText = rawText.replace(/^\n/g, ``);

        let aiReply;
        if(!prompt){
          aiReply = await interaction.editReply(`> *${userprompt}*\n\r${cleanText}`);
        } else {
          await thinkMessage.delete();
          aiReply = await interaction.reply(`\n\r${cleanText}`);
        }

        // Save the bot's message to the database.
        const botmessage = {
          text: cleanText,
          isUser: false,
          userID: clientId,
          timestamp: aiReply.createdTimestamp,
          sessionID: aiReply.channel.id,
        };
        db.messages.save(botmessage);
      })
      .catch(function (error) {
        // handle error
        interaction.reply(`Sorry, a response could not be generated.`);
        console.log(error);
        console.log(my_json);
      })
  },
};

