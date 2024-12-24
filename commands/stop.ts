import { ActivityType, type CacheType, type ChatInputCommandInteraction, type Client } from "discord.js"
import { exec } from 'child_process'
import { isServerOnline } from "../service/apiService"
import { ServerStatus } from "../enums"
export default <Command>{
    name: 'stop',
    description: 'Stop the Palworld server.',
    action: async (interaction : ChatInputCommandInteraction<CacheType>, client : Client<boolean> ) => {
        await interaction.deferReply()
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


const stopServer = () => {
    const shellCommand = `sudo systemctl stop palserver`
    return new Promise((resolve, reject) => {
        exec(shellCommand, (err, stdout, stderr) => {
            if (err || stderr) {
                reject(`Error executing stop command ${err || stderr}`)
            }

            resolve(stdout)
        })
    })
    
}