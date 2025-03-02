const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
     
module.exports = {
    data: new SlashCommandBuilder()
        .setName('requestinfo')
        .setDescription('list of all outgoing requests')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the requestor')),

    async execute(interaction) {
        await interaction.reply({ content: 'All requests sent!', ephemeral: true });
    }
};