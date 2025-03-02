const { ComponentType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

const material = new StringSelectMenuBuilder()
    .setCustomId('material')
    .setPlaceholder('Pick a resource')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('Stone')
            .setValue('stone'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Dirt')
            .setValue('dirt'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Wood')
            .setValue('wood'),
    );

const amount = new StringSelectMenuBuilder()
    .setCustomId('amount')
    .setPlaceholder('Pick an amount')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('16')
            .setValue('16'),
        new StringSelectMenuOptionBuilder()
            .setLabel('32')
            .setValue('32'),
        new StringSelectMenuOptionBuilder()
            .setLabel('64')
            .setValue('64'),
        new StringSelectMenuOptionBuilder()
            .setLabel('128')
            .setValue('128'),
        new StringSelectMenuOptionBuilder()
            .setLabel('256')
            .setValue('256'),
    );

const purpose = new StringSelectMenuBuilder()
    .setCustomId('purpose')
    .setPlaceholder('What is the purpose of this order?')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('Building')
            .setValue('building'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Combat')
            .setValue('combat'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Trading')
            .setValue('trading'),
    );

module.exports = {
    data: new SlashCommandBuilder()
        .setName('order')
        .setDescription('Order for ANYTHING!'),
    async execute(interaction) {

		/*const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Order')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel Order')
			.setStyle(ButtonStyle.Primary);*/

		const row1 = new ActionRowBuilder()
			.addComponents(material);
        const row2 = new ActionRowBuilder()
			.addComponents(amount);
        const row3 = new ActionRowBuilder()
			.addComponents(purpose);

		const message = await interaction.reply({
            content: `${interaction.user.username}'s request`,
            components: [row1, row2, row3],
        });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15_000 });

        collector.on('collect', i => {
            if (i.user.id === interaction.user.id) {
                i.reply(`${i.user.id} clicked on ${i.values[0]}`);
            }
        });
        
        collector.on('end', collected => {
            console.log(`Collected ${JSON.stringify(collected)} interactions.`);
        });
	},
};