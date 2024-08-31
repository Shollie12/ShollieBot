/*
The 'qr' command sends an HTTP request to https://api.qrserver.com/v1/create-qr-code/?data=${link}&size=512x512
once given a link and posts an embed with the returned QR code.
*/
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qr')
        .setDescription('Turns any Link into a QR code!')
        .addStringOption(option =>
            option
                .setName('link')
                .setDescription('Paste the link you would like to turn into a QR code')
                .setRequired(true)),

    async execute(interaction, linkOption) {
        // Chat Command Support
        let link;
        if(!linkOption) {
            link = interaction.options.getString('link', true);
        } else {
            link = linkOption;
        }

        const qrEmbed = new EmbedBuilder()
            .setColor('White')
            .setImage(`https://api.qrserver.com/v1/create-qr-code/?data=${link}&size=512x512`)
            .setTitle('QR code Generated! :tada:')
            .setTimestamp();
        await interaction.reply({ embeds: [qrEmbed] });
    }
}