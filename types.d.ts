import Discord = require('discord.js');
// ------------------------------- Interfaces ------------------------------- //
export interface ConfigInfo {
    msgSelfDeleteMilSec: number,                // Number of milliseconds before a message self destructs
    channels: Record<string, TextChannelInfo>   // Mappings between Channel ID: string --> TextChannelInfo
}

export interface TextChannelInfo {
    name?: string,                              // Name of the channel (for printing purposes only)
    channel?: Discord.TextChannel,              // No need to provide this during obj declaration
    msgSelfDeleteMilSec?: number,               // Override msgSelfDeleteMilSec in ConfigInfo
    calendarId: string                          // Required public Google Calendar ID 
}
