const { ActionRowBuilder, Events, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('massrequest')
        .setDescription('Requests for more than 1 item!'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('massrequest')
            .setTitle(`Request for ${interaction.user.username}`)

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
        
        const purposeInput = new TextInputBuilder()
            .setCustomId('purposeInput')
            .setLabel("List all purposes")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
        
        const row1 = new ActionRowBuilder().addComponents(materialInput);
        const row2 = new ActionRowBuilder().addComponents(amountInput);
        const row3 = new ActionRowBuilder().addComponents(purposeInput);

        modal.addComponents(row1, row2, row3);

        await interaction.showModal(modal);
	}
};