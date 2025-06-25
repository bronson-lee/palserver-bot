import { exec } from 'child_process'
import { getInfo, getPlayers } from '../connectors/palworldConnector'

let PROCESS : Bun.Subprocess | null = null

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
    PROCESS = Bun.spawn(['sh', './game/PalServer.sh'])

    return new Promise(async (resolve, reject) => {
        let serverOnline = false
        while (!serverOnline) {
            serverOnline = await isServerOnline()
        }
        resolve(serverOnline)
    })
}

export const stopServer = () => {
    if(!PROCESS) {
        return Promise.resolve(true)
    }

    return new Promise((resolve, reject) => {
        PROCESS?.kill('SIGTERM')
        PROCESS = null
        resolve(true)
    })
}

export const updateServer = () => {
    const shellCommand = `$HOME/steamcmd/steamcmd.sh +login anonymous +app_update 2394010 +quit`
    return new Promise((resolve, reject) => {
        exec(shellCommand, (err, stdout, stderr) => {
            if(err || stderr) {
                reject(`Error updating server. ${err || stderr}`)
            }
    
            resolve(stdout)
        })
    })
}