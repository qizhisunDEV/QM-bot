const { ActionRowBuilder, Events, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('massdeposit')
        .setDescription('Deposits for more than 1 item!'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('massdeposit')
            .setTitle(`Deposit for ${interaction.user.username}`)

        const materialInput = new TextInputBuilder()
            .setCustomId('materialInput')
            .setLabel("List all materials")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const amountInput = new TextInputBuilder()
            .setCustomId('amountInput')
            .setLabel("List all amounts in order")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const row1 = new ActionRowBuilder().addComponents(materialInput);
        const row2 = new ActionRowBuilder().addComponents(amountInput);

        modal.addComponents(row1, row2);

        await interaction.showModal(modal);
	}
};