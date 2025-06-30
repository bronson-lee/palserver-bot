import logger from "../utils/logger";

export default class CommandLock {
    static #lockState : boolean = false

    static isLocked() {
        return CommandLock.#lockState;
    }

    static lock() {
        if(!CommandLock.#lockState) {
            CommandLock.#lockState = true
            logger.info("Successfully locked state.")
        } else {
            throw "Attempted to obtain lock while state is already locked."
        }
    }

    static unlock() {
        CommandLock.#lockState = false
        logger.info("Successfully unlocked state.")
    }
}