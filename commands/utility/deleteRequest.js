const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
     
module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleterequest')
        .setDescription('Delete a request'),

    async execute(interaction) {
        await interaction.followUp('Request deleted!');
    }
};