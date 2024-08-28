const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
module.exports = {
    data : new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(`Displays a User's avatar!`)
        .addUserOption((option) => 
            option
                .setName('user')
                .setDescription(`Which User's avatar would you like to see?`)
                .setRequired(true)),

    async execute(interaction) {
        const { channel, options, client, member } = interaction;
        let user =  interaction.options.getUser('user') || interaction.member;
        let userAvatar = user.displayAvatarURL({ size: 1024});

    const embed = new EmbedBuilder()
        .setColor('Gold')
        .setTitle('The Avatar you requested :tada:')
        .setImage(`${userAvatar}`)
        .setTimestamp();

    const button = new ButtonBuilder()
    .setLabel('Linked Avatar')
    .setStyle(ButtonStyle.Link)
    .setURL(`${user.avatarURL({size: 1024})}`);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
        embeds: [embed],
        components: [row],
    });
    }}
