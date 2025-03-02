const { SlashCommandBuilder, PermissionFlagsBits, escapeHeading } = require('discord.js');
     
module.exports = {
    data: new SlashCommandBuilder()
        .setName('depositinfo')
        .setDescription('list of all resources')
        .addStringOption(option =>
            option.setName('material')
                .setDescription('The specified material to search for')),

    async execute(interaction) {
        await interaction.reply({ content: `${interaction.user} All materials sent!`, ephemeral: true });
    }
};