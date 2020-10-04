// ---------------------------- cache definition ---------------------------- //
export interface BotCache {
    [channelId: string]: import('discord.js').TextChannel  // channelId string -> Discord.TextChannel
}
