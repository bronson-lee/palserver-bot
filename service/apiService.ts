import { exec } from 'child_process'
import { getInfo, getPlayers } from '../connectors/palworldConnector'

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
    const shellCommand = 'sudo systemctl start palserver'
    return new Promise((resolve, reject) => {
        exec(shellCommand, async (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(err || stderr)
                reject(`Error executing start command ${err || stderr}`)
            }

            let serverOnline = false
            while (!serverOnline) {
                serverOnline = await isServerOnline()
            }
            resolve(serverOnline)
        })
    })
}

export const stopServer = () => {
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

export const updateServer = () => {
    const shellCommand = `HOME=$HOME /usr/games/steamcmd +login anonymous +app_update 2394010 validate +quit`
    return new Promise((resolve, reject) => {
        exec(shellCommand, (err, stdout, stderr) => {
            if(err || stderr) {
                reject(`Error updating server. ${err || stderr}`)
            }
    
            resolve(stdout)
        })
    })
}