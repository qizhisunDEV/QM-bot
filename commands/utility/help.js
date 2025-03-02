const { SlashCommandBuilder } = require('discord.js');
     
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('A list of all commands and uses'),

    async execute(interaction) {
        await interaction.reply({ content:
        `Requests are sent in #request-log channel and can be deleted with reactions (checkmark and X)

        /request- single request with fields for material, amount, and purpose
        /massrequest- a modal/form that gives option for multiple requests
        /requestinfo- outputs all current requests, it has an optional field for user, 
            if there is an user inputted, it will spit out the requests of that user, 
            if not then it will spit out all the requests
        /deleteallrequest- deletes all current requests
            
        Deposits are sent in #deposit-log channel, each one is deposited in the database and posted to the google sheet.

        /deposit- single deposit with fields for material and amount
        /massdeposit- a modal/form that gives option for multiple requests
        /depositinfo- outputs a txt file of all current deposits
        /withdrawdeposit- withdraw a certain amount of a material with an optional field for amount, if left blank the entirety will be withdrawn
        /deletealldeposit- deletes all current deposit`, ephermal: true});
    }
};