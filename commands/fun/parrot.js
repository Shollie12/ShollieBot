const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('parrot')
        .setDescription('Repeats *exactly* what you say to it!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to be repeated.')
                .setRequired(true)),
    async execute(interaction){
        const messsage = interaction.option.getString('message', true);

        try{
            await interaction.reply('*sqwuak!*' + message + '*squawk!*');
        }
        catch(error){
            console.error(error);
            await interaction.reply('*sqwuak!* There was an error repeating your message! *squawk!*\n\'' + error.message +'\'');
        }
        
    }
}