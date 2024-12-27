import { ActivityType, type CacheType, type ChatInputCommandInteraction, type Client } from "discord.js"
import { isServerOnline, stopServer } from "../service/apiService"
import { ServerStatus } from "../enums"
export default <Command>{
    name: 'stop',
    description: 'Stop the Palworld server.',
    requiresLock: true,
    action: async (interaction : ChatInputCommandInteraction<CacheType>, client : Client<boolean> ) => {
        return isServerOnline()
        .then(async (isOnline) => {
            if(isOnline) {
                await stopServer()
                client.user?.setActivity({
                    name: ServerStatus.OFFLINE,
                    type: ActivityType.Custom
                })
                await interaction.editReply("Server is now offline.")
            } else {
                return interaction.editReply("Server is already offline.")
            }
        })
    }
}