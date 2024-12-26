import { ActivityType, type CacheType, type ChatInputCommandInteraction, type Client } from "discord.js";
import { isServerOnline, startServer, stopServer } from "../service/apiService";
import { ServerStatus } from "../enums";
import { sleep } from "bun";

export default<Command> {
    name: 'restart',
    description: "Restart the Palworld server.",
    action: async (interaction : ChatInputCommandInteraction<CacheType>, client : Client<boolean> ) => {
        return isServerOnline()
        .then(async (isOnline) => {
            if(!isOnline) {
                return interaction.editReply("Server is not online. Did you mean to /start?")
            } else {
                client.user?.setActivity({
                    name: ServerStatus.RESTART,
                    type: ActivityType.Custom
                })
                await stopServer()
                await sleep(1000)
                await startServer()
                client.user?.setActivity({
                    name: ServerStatus.ONLINE,
                    type: ActivityType.Custom
                })
                return interaction.editReply("Server has restarted!")
            }
        }).catch(async (err) => {
            console.error(err)
            try {
                await stopServer()
                client.user?.setActivity({
                    name: ServerStatus.OFFLINE,
                    type: ActivityType.Custom
                })
                return interaction.editReply("Failed to restart the server. An error has occured!")  
            } catch (err) {
                console.error("A fatal exception has occured!", err)
            }
        })
    }
}