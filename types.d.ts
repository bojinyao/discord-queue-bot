import Discord = require('discord.js');
// ------------------------------- Interfaces ------------------------------- //
export interface ConfigInfo {
    msgSelfDeleteMilSec: number,                // Number of milliseconds before a message self destructs
    channels: Record<string, TextChannelInfo>,  // Mappings between Channel ID: string --> TextChannelInfo
    canvasCourseNum?: string
}

export interface TextChannelInfo {
    calendarId: string                          // [Required] Public Google Calendar ID
    name?: string,                              // [Recommended] Name of the channel (for printing purposes only)
    channel?: Discord.TextChannel,              // No need to provide this during obj declaration
    msgSelfDeleteMilSec?: number,               // Override msgSelfDeleteMilSec in ConfigInfo 
}
