const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
     
module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteallrequest')
        .setDescription('Delete all requests'),

    async execute(interaction) {
        //await interaction.reply({ content: `<@&$${interaction.member.roles.cache.find(r => r.name === "QM")}> All request deleted!`});
        const channel = interaction.guild.channels.cache.find(channel => channel.name === "request-log");
        const role = interaction.guild.roles.cache.find(rol => rol.name === "QM");
        await interaction.guild.channels.cache.get(channel.id).send({ content: `${role} All request deleted!`});
        await interaction.reply( {content: "Deleted!", ephemeral: true } );
        //msg.channel.send(`<@&${roleId}> Found one!! ${msga}`);
    }
};