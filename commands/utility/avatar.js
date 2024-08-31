/*
The 'avatar' command creates an embed with the user's avatar.
*/
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
    async execute(interaction, userOption) {
        // Chat Command Support
        let user;
        if(!userOption) {
            user = interaction.options.getUser('user') || interaction.member;
        } else {
            userOption = userOption.replace(/[<@>]/g, ``);
            user = interaction.guild.members.cache.get(userOption);
        }
        
        const userAvatar = user.displayAvatarURL({ size: 1024});

        const embed = new EmbedBuilder()
            .setColor('Gold')
            .setTitle('The Avatar you requested :tada:')
            .setImage(`${userAvatar}`)
            .setTimestamp();

        const button = new ButtonBuilder()
        .setLabel('Linked Avatar')
        .setStyle(ButtonStyle.Link)
        .setURL(`${userAvatar}`);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    }}
