const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
     
module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdrawdeposit')
        .setDescription('Withdraw materials')
        .addStringOption(option => 
            option.setName('material')
                .setDescription('Material to be withdrawn')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to be withdrawn')),

    async execute(interaction) {
        if (interaction.options.getInteger('amount') !== null) {
            await interaction.reply(`${interaction.user} withdrawn ${amount} ${material}!`);
        } else {
            await interaction.reply(`${interaction.user} withdrawn all of ${material}!`);
        }
    }
};