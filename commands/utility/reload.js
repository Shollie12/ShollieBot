/*
The 'reload' command reloads a specified command negating the need
to turn the bot on and off again. This will only reload the 'execute'
section. To reload the name or description, type 'node deploy-commands.js'
into the terminal.
*/
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`There is no command with the name \`${commandName}\``);
        }

        //Scans all files in all folders in the 'commands' folder (or whatever file is 2 directories above)
        let filePathtoReload = null;
        const foldersPath = path.join(__dirname, '..');
        const folders = fs.readdirSync(path.join(__dirname, '..')).filter(folder => folder != ".DS_Store");;
        for (const folder of folders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                if (file.toString() == command.data.name + `.js`) {
                    const filePath = path.join(commandsPath, file);
                    filePathtoReload = filePath;
                    break;
                }
            }
            if (filePathtoReload != null) break;
        }

        //Attempts to delete the file from the saved cache and then re-instate it.
        try {
            delete require.cache[require.resolve(filePathtoReload)];

            const newCommand = require(filePathtoReload);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }

    },
};