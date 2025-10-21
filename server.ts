import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';
import type { CacheType, ChatInputCommandInteraction } from 'discord.js'
import { commands } from './src/commands'
import { isServerOnline } from './src/service/apiService'
import { ServerStatus } from './src/enums';
import CommandLock from './src/models/commandLock';
import checkPlayersOnline from './src/service/checkPlayersJob';
import updateServerJob from './src/service/updateServerJob';
import logger from './src/utils/logger';

const { DISCORD_TOKEN } = process.env

if(!DISCORD_TOKEN) {
    logger.error('Unset DISCORD_TOKEN environment variable.')
    process.exit(0)
}
const teardown = () => {
    client.user?.setPresence({
        status: 'invisible',
        activities: []
    })
    client.destroy()
    process.exit(0)
}

const processCommand = async (command : Command, interaction : ChatInputCommandInteraction<CacheType>, client : Client<boolean>) : Promise<any> => {
    logger.info(`Recieved '${command.name}' command`)
    await interaction.deferReply()

    const { name, requiresLock } = command
    if(!requiresLock) {
        return command.action( interaction, client )
    } else {
        if(CommandLock.isLocked()) {
            return interaction.editReply(`Cannot /${name} at this time. Please try again later.`)
        } else {
            CommandLock.lock()
            return command.action( interaction, client )
            .finally(CommandLock.unlock)
        }
    }
}

const isOnline = await isServerOnline()

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds],
    presence: {
        status: 'online',
        activities: [{
            name: isOnline ? ServerStatus.ONLINE : ServerStatus.OFFLINE,
            type: ActivityType.Custom
        }]
    }
});

client.on(Events.ClientReady, readyClient => {
    logger.info(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return

    for(const command of commands) {
        if(command.name === interaction.commandName) {
            await processCommand(command, interaction, client)
            return
        }
    }

    logger.error(`Recieved unhandled command '${interaction.commandName}'`)
});

process.on('SIGINT', teardown)
process.on('SIGTERM', teardown)

client.login(process.env.DISCORD_TOKEN);
setInterval(() => checkPlayersOnline(client), 600000)
updateServerJob()

Bun.serve({
	routes: {
		'/healthcheck': new Response('OK'),
    }
})