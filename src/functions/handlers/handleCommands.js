const { REST, Routes } = require("discord.js")
const fs = require("fs");

module.exports = (client) => {
client.handleCommands = async () => {
 	const commandFolders = fs.readdirSync("./src/commands");
		for (const folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`./src/commands/${folder}`)
				.filter((file) => file.endsWith(".js"));

			const { commands, commandArray } = client

			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`)
				commands.set(command.data.name, command)
				commandArray.push(command.data.toJSON())
			}
		}

		const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env
		const rest = new REST().setToken(DISCORD_TOKEN)

		try {
			console.log("Started refreshing application (/) commands.")

			await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
				body: client.commandArray,
			})

			console.log("Successfully reloaded application (/) commands.")
		} catch (error) {
			console.log(error)
		}
    };
};
