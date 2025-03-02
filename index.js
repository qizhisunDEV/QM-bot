require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Sequelize } = require('sequelize');
const { google } = require('googleapis');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const serviceAccountKeyFile = process.env.SERVICE_FILE;

var googleClient;

client.once(Events.ClientReady, async readyClient => {
	await Tags.sync();
	await Deps.sync();
	googleClient = await _getGoogleSheetClient();
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

async function _getGoogleSheetClient() {
	const auth = new google.auth.GoogleAuth({
	  keyFile: serviceAccountKeyFile,
	  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});
	const authClient = await auth.getClient();
	return google.sheets({
	  version: 'v4',
	  auth: authClient,
	});
  }

async function appendValues(num, m, amo) {
	let values = [
		[
		m, parseInt(amo)
		],
	];
	const resource = {
		values,
	};
	try {
		await googleClient.spreadsheets.values.append({
		spreadsheetId: process.env.SHEET_ID,
		range: 'Sheet1!A' + (num + 1) + ':B' + (num + 1),
		valueInputOption: 'USER_ENTERED',
		resource,
		});
	} catch (err) {
		throw err;
	}
}

async function updateValues(num, amo, val) {
	let values = [
		[
		amo + val
		],
	];
	const resource = {
		values,
	};

	try {
		await googleClient.spreadsheets.values.update({
			spreadsheetId: process.env.SHEET_ID,
			range: 'Sheet1!B' + (num + 1),
			valueInputOption: 'USER_ENTERED',
			resource,
		});
	} catch (err) {
		throw err;
	}
}

async function deleteValues(num) {
	try {
		await googleClient.spreadsheets.values.clear({
			spreadsheetId: process.env.SHEET_ID,
			range: 'Sheet1!A' + (num + 1) + ':B' + (num + 1)
		});
	} catch (err) {
		throw err;
	}
}

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

var Tags = sequelize.define('tags', {
	source: Sequelize.STRING,
	material: Sequelize.STRING,
	amount: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	purpose: Sequelize.STRING,
});

var Deps = sequelize.define('deps', {
	material: Sequelize.STRING,
	amount: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	num: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

var pad = function(arr,len,fill) {
	return arr.concat(Array(len).fill(fill)).slice(0,len);
}

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log('[WARNING] The command at ${filePath} is missing required "data" or "execute" property.');
		}
	}
}

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}
	if (user.bot) return;
	const msg = reaction.message;
	const channel = msg.guild.channels.cache.find(channel => channel.name === "request-log");
	if (msg.channelId === channel.id && (reaction.emoji.name === "✅" || reaction.emoji.name === "❎")) {
		const words = msg.content.split(" ");
		const mat = words[8];
		const og = await Deps.findOne( { where: { material: mat } } );
		const n = parseInt(words[7]);
		if (og !== null) {
			if (og.amount - n > 0) {
				console.log(og.amount - n);
				await Tags.destroy({ where: { source: words[0], material: words[8], amount: words[7], purpose: words[4] } });
				if (reaction.emoji.name === "✅"){
					await Deps.increment({ amount: -n }, { where: { material: mat } });
					await updateValues(og.num, og.amount, -n).catch(console.error);
					await Deps.increment({ amount: -n }, { where: { material: mat } });
				}
			}
			else if (og.amount - n === 0) {
				console.log(og.amount - n);
				await Tags.destroy({ where: { source: words[0], material: words[8], amount: words[7], purpose: words[4] } });
				if (reaction.emoji.name === "✅"){
					await Deps.destroy( { where: { material: mat } } );
					await deleteValues(og.num).catch(console.error);
				}
			}
			
		}
		msg.delete();
	}
})

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		if (interaction.commandName === 'requestinfo') {
			try {
				const req = interaction.options.getString('username');
				var reqList = await Tags.findAll();
				var newList = [];
				for (let i = 0; i < reqList.length; i++){
					if (req !== "" && req != null){
						if (reqList[i].source === req) {
							newList.push(reqList[i].source + ' has submitted a ' + reqList[i].purpose + ' request for ' + reqList[i].amount + " " + reqList[i].material);
						}
					} else {
						newList.push(reqList[i].source + ' has submitted a ' + reqList[i].purpose + ' request for ' + reqList[i].amount + " " + reqList[i].material);
					}
				}
	
				console.log(reqList.length);
				newList = newList.join("\n");
				fs.writeFile('./requests.txt', newList, err => {
					if (err) {
						console.error(err);
					} else {

					}
				});

				await interaction.channel.send( { files: ['requests.txt'], ephemeral: true});

			} catch (error) {
				console.error(error);
			}
		} else if (interaction.commandName === 'depositinfo') {
			try {
				const mat = interaction.options.getString('material');
				var matList = await Deps.findAll();
				var newList = [];
				for (let i = 0; i < matList.length; i++){
					if (mat !== "" && mat != null){
						if (matList[i].source === mat) {
							newList.push(`${matList[i].material} : ${matList[i].amount}`);
						}
					} else {
						newList.push(`${matList[i].material} : ${matList[i].amount}`);
					}
				}
				newList = newList.join("\n");
				console.log(matList.length);

				fs.writeFile('./resources.txt', newList, err => {
					if (err) {
						console.error(err);
					} else {

					}
				});

				await interaction.channel.send( { files: ['resources.txt'], ephemeral: true});


			} catch (error) {
				console.error(error);
			}
		} else if (interaction.commandName === 'deleterequest') {
			try {
				/*const reqSource = interaction.options.getString('source');
				const reqMaterial = interaction.options.getString('material');
				const reqAmount = interaction.options.getString('amount');
				const reqPurpose = interaction.options.getString('purpose');

				const req = await Tags.destroy({ where: { source: reqSource, material: reqMaterial, amount: reqAmount, purpose: reqPurpose} });*/
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.commandName === 'deleteallrequest') {
			try {
				var reqList = await Tags.findAll();
				for (let i = 0; i < reqList.length; i++){
					await Tags.destroy({ where: { source: reqList[i].source, material: reqList[i].material, amount: reqList[i].amount, purpose: reqList[i].purpose } });
				}
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.commandName === 'deletealldeposit') {
			try {
				var matList = await Deps.findAll();
				for (let i = 0; i < matList.length; i++){
					await deleteValues(i + 1).catch(console.error);
					await Deps.destroy({ where: { material: matList[i].material, amount: matList[i].amount } });
				}
				
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.commandName === 'withdrawdeposit') {
			try {
				const mat = interaction.options.getString('material');
				const og = await Deps.findOne( { where: { material: mat } } );
				const n = interaction.options.getInteger('amount') ?? null;
				if (n !== null && n !== 0){
					const g = og.amount;
					await Deps.increment({ amount: -n }, { where: { material: mat } });
					await updateValues(og.num, og.amount, -n).catch(console.error);
					await Deps.increment({ amount: -n }, { where: { material: mat } });
				} else {
					await deleteValues(og.num).catch(console.error);
					await Deps.destroy({ where: { material: mat} });
				}
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.commandName === 'request'){
			const material = interaction.options.getString('material');
			const amount = interaction.options.getString('amount');
			const purpose = interaction.options.getString('purpose');

			const channel = interaction.guild.channels.cache.find(channel => channel.name === "request-log");
			const message = await interaction.guild.channels.cache.get(channel.id).send( {content: `${interaction.user.username} has submitted a ${purpose} request for ${amount} ${material}` } );
			
			message.react('✅');
			message.react('❎');
		} else if (interaction.commandName === 'deposit'){
			var a = interaction.options.getString('material');
			var b = interaction.options.getString('amount');

			if (a !== undefined && b !== undefined){
				var matList = await Deps.findAll();
				const q = await Deps.findOne( { where: {material: a} } );
				if (q === null){
					await Deps.create({
						material: a,
						amount: b,
						num: parseInt(matList.length + 1)
					});
					await appendValues(Deps.length, a, b).catch(console.error);
				} else {
					const og = await Deps.findOne( { where: { material: a } } );
					const g = og.amount;
					await Deps.increment({ amount: b }, { where: { material: a } });
					await updateValues(og.num, g, b).catch(console.error);
				}
				
				const channel = interaction.guild.channels.cache.find(channel => channel.name === "deposit-log");
				await interaction.guild.channels.cache.get(channel.id).send({ content: `${b} ${a} was deposited` });
			}
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
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
			try {
				var a = interaction.fields.getTextInputValue('materialInput').replaceAll(",", ' ').split(" ");
				var b = interaction.fields.getTextInputValue('amountInput').replaceAll(",", ' ').split(" ");
				var c = interaction.fields.getTextInputValue('purposeInput').replaceAll(",", ' ').split(" ");
		
				for (let i = 0; i < a.length; i++) {
					if (a[i] !== undefined && b[i] !== undefined && c[i] !== undefined){
						await Tags.create({
							source: interaction.user.username,
							material: a[i],
							amount: b[i],
							purpose: c[i],
						});
						const channel = interaction.guild.channels.cache.find(channel => channel.name === "request-log");
						const message = await interaction.guild.channels.cache.get(channel.id).send({ content: `${interaction.user.username} has submitted a ${c[i]} request for ${b[i]} ${a[i]}` });
						message.react('✅');
						message.react('❎');
					}
				}
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.customId === 'massdeposit'){
			await interaction.reply({ content: "Your deposit has been submitted", ephemeral: true})
			try {
				var a = interaction.fields.getTextInputValue('materialInput').replaceAll(",", ' ').split(" ");
				var b = interaction.fields.getTextInputValue('amountInput').replaceAll(",", ' ').split(" ");
		
				for (let i = 0; i < a.length; i++) {
					if (a[i] !== undefined && b[i] !== undefined){
						var matList = await Deps.findAll();
						const q = await Deps.findOne( { where: {material: a[i]} } );
						if (q === null){
							await Deps.create({
								material: a[i],
								amount: b[i],
								num: parseInt(matList.length + 1)
							});
							await appendValues(Deps.length, a[i], b[i]).catch(console.error);
						} else {
							const og = await Deps.findOne( { where: { material: a[i] } } );
							const g = og.amount;
							await Deps.increment({ amount: b[i] }, { where: { material: a[i] } });
							await updateValues(og.num, g, b[i]).catch(console.error);
						}
						
						const channel = interaction.guild.channels.cache.find(channel => channel.name === "deposit-log");
						await interaction.guild.channels.cache.get(channel.id).send({ content: `${b[i]} ${a[i]} was deposited` });
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	} else {
		return;
	}
});

client.login(process.env.TOKEN);