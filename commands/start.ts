import { ActivityType } from "discord.js"
import { ServerStatus } from "../enums"
import { isServerOnline } from "../service/apiService"
import { exec } from 'child_process'
export default <Command>{
    name: 'start',
    description: 'Start the Palworld Server.',
    action: async (interaction, client) => {
        await interaction.deferReply()
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

const startServer = () => {
    const shellCommand = 'sudo systemctl start palserver'
    return new Promise((resolve, reject) => {
        exec(shellCommand, (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(err || stderr)
                reject(`Error executing start command ${err || stderr}`)
            }
            resolve(stdout)
        })
    })
}