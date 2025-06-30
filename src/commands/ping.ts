import type { CacheType, ChatInputCommandInteraction } from "discord.js";

export default <Command>{
    name: "ping",
    description: "Hello World!",
    action: async (interaction : ChatInputCommandInteraction<CacheType>) => {
        await interaction.reply('Pong!');
    }
}