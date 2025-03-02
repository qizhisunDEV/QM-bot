const { Events } = require('discord.js');
import { Tags } from './index.js'

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isButton()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isModalSubmit()){

            if (interaction.customId === 'massrequest'){
                await interaction.reply({ content: "Your request has been submitted", ephemeral: true})
            }
            try {
                const a = interaction.fields.getTextInputValue('materialInput').split(" ");
                const b = interaction.fields.getTextInputValue('amountInput').split(" ");
                const c = interaction.fields.getTextInputValue('purposeInput').split(" ");
        
                for (let i = 0; i < a.length; i++) {
                    await Tags.create({
                        source: interaction.user.username,
                        material: a[i],
                        amount: b[i],
                        purpose: c[i],
                    });
                    console.log(`${interaction.user.username} has submitted a ${c[i]} request for ${b[i]} ${a[i]}`);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            return;
        }
	}
};