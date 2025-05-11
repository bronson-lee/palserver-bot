export default class CommandLock {
    static #lockState : boolean = false

    static isLocked() {
        return CommandLock.#lockState;
    }

    static lock() {
        CommandLock.#lockState = true
    }

    static unlock() {
        CommandLock.#lockState = false
    }
}