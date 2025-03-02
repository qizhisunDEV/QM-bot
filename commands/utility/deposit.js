const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
        
const data = new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit materials!')
    .addStringOption(option =>
        option.setName('material')
            .setDescription('The material wanted')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('amount')
            .setDescription('The amount wanted')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Member)
    .setDMPermission(false);

module.exports = {
    data,
    async execute(interaction) {
        await interaction.reply(`Material deposited!`)
    },
};