export default class CommandLock {
    private static lock : boolean = false

    public static isLocked() {
        return this.lock;
    }

    public static setLock( state : boolean ) {
        this.lock = state
    }
}