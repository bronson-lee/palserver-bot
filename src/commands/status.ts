import type { CacheType, ChatInputCommandInteraction } from "discord.js";
import { isServerOnline } from '../service/apiService'
export default <Command>{
    name: "status",
    description: "Get the status of the server.",
    action: async (interaction : ChatInputCommandInteraction<CacheType>) => {
        return isServerOnline()
        .then((isOnline) => {
            return isOnline ? interaction.editReply('Server is **online**.') : interaction.editReply('Server is **offline**.')
        })
    }
}