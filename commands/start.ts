import { ActivityType } from "discord.js"
import type { CacheType, ChatInputCommandInteraction, Client } from 'discord.js'
import { ServerStatus } from "../enums"
import { isServerOnline, startServer } from "../service/apiService"
export default <Command>{
    name: 'start',
    description: 'Start the Palworld server.',
    action: async (interaction : ChatInputCommandInteraction<CacheType>, client : Client<boolean>) => {
        return isServerOnline()
        .then(async (isOnline) => {
            if(isOnline) {
                return interaction.editReply("Server is already online.")
            } else {
                await startServer()
                client.user?.setActivity({
                    name: ServerStatus.ONLINE,
                    type: ActivityType.Custom
                })
                return interaction.editReply("Server is now online.")
            }
        })
    }
}