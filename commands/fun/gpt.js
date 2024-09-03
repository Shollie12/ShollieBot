/*
The 'gpt' command sends an HTTP request to http://localhost:5001/api/v1/generate
once koboldcpp is running and responds with an AI generated response.
*/
const { SlashCommandBuilder } = require('discord.js');
const { clientId } = require('../../config.json');
const path = require('path');
const axios = require('axios');

// Connect to the database.
const pathToFolder = path.join(__dirname, '../../db');
const db = require('diskdb');
db.connect(pathToFolder, ['messages']);

// Edit options for the generated response.
const cppconfig = require('./cppconfig.json');
const { channel } = require('diagnostics_channel');
  
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
    let userPrompt;
    if(!prompt){
      userPrompt = interaction.options.getString('prompt', true);
    } else {
      userPrompt = prompt;
    }

    let thinkMessage;
    if(!prompt){
      await interaction.deferReply();
    } else {
      thinkMessage = await interaction.channel.send(`:thinking: Thinking...`);
    }
    
    // Add context to the User's prompt
    const stop_sequence = ["### Instruction:", "### Response:"]
    const channelID = interaction.channel.id;
    const rawContext = db.messages.find({sessionID: channelID});
    rawContext.sort(function(a, b){
      return a.timestamp - b.timestamp;
    });
    let contextPrompt = ``;
    rawContext.forEach(msg => {
      //contextPrompt += `\n${msg.username}: ` + msg.text;
      if(msg.isUser){
        contextPrompt += stop_sequence[0] + msg.text + stop_sequence[1];
      } else {
        //contextPrompt += stop_sequence[1] + msg.text;
        contextPrompt += msg.text;
      }
    });
    //contextPrompt += `\n${interaction.member.nickname}: ` + userPrompt;
    contextPrompt += stop_sequence[0] + userPrompt + stop_sequence[1];
    cppconfig.prompt = contextPrompt;

    //Add user's message to the database
    const usermessage = {
      text: userPrompt,
      isUser: true,
      userID: interaction.member.id,
      username: interaction.member.nickname,
      timestamp: interaction.createdTimestamp,
      sessionID: channelID,
    };
    db.messages.save(usermessage);

    await axios.post(`http://localhost:5001/api/v1/generate`, cppconfig)
      .then(async function (response) {
        // Clean text and print raw text.
        const rawText = response.data.results[0].text;
        console.log(`\nThis is the raw text: ${rawText.replace(/\n/g, `\\n`).replace(/\r/g, `\\r`)}`);
        const cleanText = rawText.replace(/^\n/g, ``);

        let aiReply;
        if(!prompt){
          aiReply = await interaction.editReply(`> *${userPrompt}*\n\r${cleanText}`);
        } else {
          await thinkMessage.delete();
          aiReply = await interaction.reply(`\n\r${cleanText}`);
        }

        // Save the bot's message to the database.
        const botmessage = {
          text: cleanText,
          isUser: false,
          userID: clientId,
          username: `Sholliebot`,
          timestamp: aiReply.createdTimestamp,
          sessionID: channelID,
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

