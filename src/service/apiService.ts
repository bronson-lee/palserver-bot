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
    Bun.spawn(['sh', `${process.env.HOME}/game/PalServer.sh`])

    return new Promise(async (resolve, reject) => {
        let serverOnline = false
        while (!serverOnline) {
            serverOnline = await isServerOnline()
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }
        resolve(serverOnline)
    })
}

export const updateServer = async (isValidate : boolean = false) => {
    return Bun.spawn([`${process.env.HOME}/update_game.sh`])
}