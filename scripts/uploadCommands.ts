import { InteractionContextType, REST, Routes, SharedSlashCommand, SlashCommandBuilder } from 'discord.js';
import { commands } from '../commands'
const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw "CLIENT_ID or TOKEN not configured."
}

const commandsUsed = new Set()
const slashCommands = []
for(const command of commands ) {
    const { name, description } = command
    if( commandsUsed.has( name ) ) {
        throw `Ambigious command declared multiple times '${name}'`
    }

    slashCommands.push(new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setContexts(InteractionContextType.Guild)
        .toJSON()
    )
    commandsUsed.add(name)
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

try {
    console.log(`Started refreshing ${commands.length} application slash commands.`);
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: slashCommands });

    console.log(`Successfully reloaded ${commands.length} application slash commands.`);
} catch (error) {
    console.error(error);
}