declare global {
    interface Command {
        name: string,
        description: string,
        requiresLock?: boolean,
        action: (interaction : ChatInputCommandInteraction<CacheType>, client : Client<boolean> ) => Promise<any>
    }
}

export {}