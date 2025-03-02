const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
     
module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletealldeposit')
        .setDescription('Delete all deposits'),

    async execute(interaction) {
        const channel = interaction.guild.channels.cache.find(channel => channel.name === "deposit-log");
        const role = interaction.guild.roles.cache.find(rol => rol.name === "QM");
        await interaction.guild.channels.cache.get(channel.id).send({ content: `${role} All resources deleted!`});
        await interaction.reply( {content: "Deleted!", ephemeral: true } );
    }
};