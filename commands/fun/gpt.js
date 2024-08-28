/*
The 'gpt' command sends an HTTP request to http://localhost:5001/api/v1/generate
once koboldcpp is running and responds with an AI generated response.
*/
const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

// Edit options for the generated response.
let my_json = {
 n: 1, 
 max_context_length: 2096,
  max_length: 200,
  rep_pen: 1.07,
  temperature: 0.7,
  top_p: 0.92,
  top_k: 100,
  top_a: 0,
  typical: 1,
  tfs: 1,
 rep_pen_range: 320,
  rep_pen_slope: 0.7,
  sampler_order: [6, 0, 1, 3, 4, 2, 5],
  memory: "", 
  trim_stop: true,
  genkey: "KCPP8197",
  min_p: 0,
 dynatemp_range: 0, 
 dynatemp_exponent: 1, 
 smoothing_factor: 0, 
 banned_tokens: [], 
 render_special: false, 
 presence_penalty: 0, 
 logit_bias: {}
}

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

    my_json.prompt = userprompt;
    console.log(JSON.stringify(my_json));

    //// Testing the GET endpoint of koboldcpp
    // await axios.get(`http://localhost:5001/api/v1/model`)
    //   .then(function(answer) {
    //     interaction.reply(`This chatbot's current model is: ${answer.data.result}`);
    //   })
    //   .catch(function(error){
    //     interaction.reply(`Sorry, couldn't get that for ya.`)
    //     console.log(error);
    //   })

    await interaction.deferReply();
    await axios.post(`http://localhost:5001/api/v1/generate`, JSON.stringify(my_json))
      .then(async function (response) {
        // handle success
        const rawText = response.data.results[0].text;
        console.log(`\nThis is the raw text: ${rawText.replace(/\n/g, `\\n`).replace(/\r/g, `\\r`)}`);
        const cleanText = rawText.replace(/^\n/g, ``);
        await interaction.editReply(`> *${userprompt}*\n\n${cleanText}`);
      })
      .catch(function (error) {
        // handle error
        interaction.reply(`Sorry, a response could not be generated.`);
        console.log(error);
        console.log(my_json);
      })
  },
};

