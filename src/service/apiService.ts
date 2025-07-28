import { exec } from 'child_process'
import { getInfo, getPlayers } from '../connectors/palworldConnector'
import logger from '../utils/logger'

export const isServerOnline = async () : Promise<boolean> => {
    return getInfo().then((response) => {
        return Boolean(response.version)
    }).catch((err) => {
        return false
    })
}

export const getPlayerCount = async () : Promise<number> => {
    return getPlayers().then((data) => data.players.length)
}

export const startServer = () => {
    logger.info("Starting up server")
    Bun.spawn(['sh', '../game/PalServer.sh'])

    return new Promise(async (resolve, reject) => {
        let serverOnline = false
        while (!serverOnline) {
            await Bun.sleep(500)
            serverOnline = await isServerOnline()
        }
        resolve(serverOnline)
    })
}

export const updateServer = (isValidate : boolean = false) => {
    const validate = isValidate ? "validate " : ""
    const shellCommand = `$HOME/steamcmd/steamcmd.sh +force_install_dir $HOME/game +login anonymous +app_update 2394010 ${validate}+quit`
    return new Promise((resolve, reject) => {
        exec(shellCommand, (err, stdout, stderr) => {
            if(err || stderr) {
                reject(`Error updating server. ${err || stderr}`)
            }
            
            resolve(stdout)
        })
    })
}