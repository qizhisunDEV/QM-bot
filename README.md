**A discord bot that manages inventory requests and stores**
# USED:
-JavaScipt\
-discord.js\
-node.js\
-googleapis\
-sequelize\
-SQLite3

# COMMANDS:
**massrequest/massdeposit**:\
  -opens a menu which allows for the user to type in multiple queries at once
	
**request/deposit**:\
  -takes an argument each for material and amount which is for singular fast inputs
	
**depositInfo/requestInfo**:\
  -sends the current deposits in a txt file sorted by the highest quantity
	
**withdrawDeposit/deleteRequest**:\
  -respectively deletes a deposit entry or a made request
	
**help**\
  -displays a basic guide for the bot

# GOOGLESHEET:
The bot is connected to google api and subsequently able to access google sheets via a service account\
**FEATURES OF THE GOOGLE SHEET**:

-A column each for both ongoing requests and a list of requests

-A dated log tab for viewing purposes

-A priority list column for which materials are needed most (by quantity)


