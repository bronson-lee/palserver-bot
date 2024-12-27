import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';
import type { CacheType, ChatInputCommandInteraction } from 'discord.js'
import { commands } from './commands'
import { isServerOnline } from './service/apiService'
import { ServerStatus } from './enums';
import CommandLock from './models/commandLock';
const { DISCORD_TOKEN } = process.env

if(!DISCORD_TOKEN) {
    throw 'Unset DISCORD_TOKEN environment variable.'
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
    await interaction.deferReply()

    const { name, requiresLock } = command
    if(!requiresLock) {
        return command.action( interaction, client )
    } else {
        if(CommandLock.isLocked()) {
            return interaction.editReply(`Cannot /${name} at this time. Please try again later.`)
        } else {
            CommandLock.setLock(true)
            return command.action( interaction, client )
            .finally(() => CommandLock.setLock(false))
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
    console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return

    for(const command of commands) {
        if(command.name === interaction.commandName) {
            await processCommand(command, interaction, client)
            return
        }
    }

    throw `Unhandled command '${interaction.commandName}'`
});

process.on('SIGINT', teardown)
process.on('SIGTERM', teardown)

client.login(process.env.DISCORD_TOKEN);