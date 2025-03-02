const { SlashCommandBuilder, Events, PermissionFlagsBits } = require('discord.js');
        
const data = new SlashCommandBuilder()
    .setName('request')
    .setDescription('Requests for ANYTHING!')
    .addStringOption(option =>
        option.setName('material')
            .setDescription('The material wanted')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('amount')
            .setDescription('The amount wanted')
            .setRequired(true)
            .setAutocomplete(true))
    .addStringOption(option =>
        option.setName('purpose')
            .setDescription('The purpose of the request')
            .setRequired(true)
            .setAutocomplete(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Member)
    .setDMPermission(false);

module.exports = {
    data,
    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices;

        if (focusedOption.name === 'amount') {
		    choices = ['16', '32', '64', '128', '256'];
        }

        if (focusedOption.name === 'purpose') {
		    choices = ['Building', 'Combat', 'Trading'];
        }

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));

		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },
    async execute(interaction) {
        await interaction.reply( { content: 'Sending your request!', ephemeral: true } )
    },
};