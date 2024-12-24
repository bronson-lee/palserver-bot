import { REST, Routes } from 'discord.js';
import { commands } from '../commands'
const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw "CLIENT_ID or TOKEN not configured."
}

const parsedCommands = []
const commandsUsed = new Set()
for(const command of commands ) {
    const { name, description } = command
    if( commandsUsed.has( name ) ) {
        throw `Ambigious command declared multiple times '${name}'`
    }

    parsedCommands.push({ name: name, description: description })
    commandsUsed.add(name)
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

try {
    console.log(`Started refreshing application ${commands.length} commands.`);

    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });

    console.log(`Successfully reloaded application ${commands.length} commands.`);
} catch (error) {
    console.error(error);
}