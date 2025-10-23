import { stopGame } from "../connectors/palworldConnector"
import { ServerStatus } from "../enums"
import { getPlayerCount, isServerOnline } from "../service/apiService"
import { ActivityType, type Client } from 'discord.js'
import logger from "../utils/logger"
import { clearInterval } from "timers"

const checkInterval = 600000

export default class CheckPlayersService {
    static #lastCheckWasEmpty = true
    static #intervalId : NodeJS.Timeout | undefined = undefined

    static #stopServerIfEmpty(discordClient : Client<boolean>) : void {
        isServerOnline().then(async isOnline => {
            if(isOnline) {
                const currentlyHasPlayersOnline = await getPlayerCount() > 0
                if(!CheckPlayersService.#lastCheckWasEmpty && !currentlyHasPlayersOnline) {
                    logger.info('Automatically stopping server')
                    discordClient.user?.setActivity({
                        name: ServerStatus.OFFLINE,
                        type: ActivityType.Custom
                    })
                    stopGame()
                } else {
                    CheckPlayersService.#lastCheckWasEmpty = currentlyHasPlayersOnline
                }
            }
        })
    }

    static startCheckInterval(discordClient : Client<boolean>) : void {
        if(CheckPlayersService.#intervalId) {
            logger.info("Cannot start check interval because it is already running.")
            return
        }

        CheckPlayersService.#intervalId = setInterval(() => CheckPlayersService.#stopServerIfEmpty(discordClient), checkInterval)
    }

    static stopCheckInterval() : void {
        if(!CheckPlayersService.#intervalId) {
            logger.info("Cannot stop check interval because it is not running.")
            return
        }

        clearInterval(CheckPlayersService.#intervalId)
        CheckPlayersService.#intervalId = undefined
    }
}