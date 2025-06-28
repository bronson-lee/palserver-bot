export default class CommandLock {
    static #lockState : boolean = false

    static isLocked() {
        return CommandLock.#lockState;
    }

    static lock() {
        if(!CommandLock.#lockState) {
            CommandLock.#lockState = true
            console.log("Successfully locked state.")
        } else {
            throw "Attempted to obtain lock while state is already locked."
        }
    }

    static unlock() {
        CommandLock.#lockState = false
        console.log("Successfully unlocked state.")
    }
}