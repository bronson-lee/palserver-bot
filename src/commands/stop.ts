import { ActivityType, Message } from "discord.js"
import type { CacheType, ChatInputCommandInteraction, Client } from 'discord.js'
import { isServerOnline } from "../service/apiService"
import { ServerStatus } from "../enums"
import { getPlayers, saveGame, stopGame } from "../connectors/palworldConnector"
export default <Command>{
    name: 'stop',
    description: 'Stop the Palworld server.',
    requiresLock: true,
    action: async (interaction : ChatInputCommandInteraction<CacheType>, client : Client<boolean> ) : Promise<Message> => {
        return isServerOnline()
        .then(async (isOnline) => {
            if(isOnline) {
                const playersOnline = await getPlayers()
                const playersOnlineCount = playersOnline.players.length
                if(playersOnlineCount) {
                    const onePlayerOnline = playersOnlineCount == 1
                    return interaction.editReply(`Could not stop server. There ${onePlayerOnline ? 'is' : 'are'} still ${playersOnlineCount} player${!onePlayerOnline ? 's' : ''} online`)
                } else {
                    await saveGame()
                    await stopGame()
                    client.user?.setActivity({
                        name: ServerStatus.OFFLINE,
                        type: ActivityType.Custom
                    })
                    return interaction.editReply("Server is now offline.")
                }
            } else {
                return interaction.editReply("Server is already offline.")
            }
        })
    }
}