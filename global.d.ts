declare global {
    interface Command {
        name: string,
        description: string,
        action: (interaction : ChatInputCommandInteraction<CacheType>, client : Client<boolean> ) => any
    }
}

export {}