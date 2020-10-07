// ------------------------------- Interfaces ------------------------------- //
export interface ConfigInfo {
    msgSelfDeleteMilSec: number,                // Number of milliseconds before a message self destructs
    channels: Record<string, TextChannelInfo>   // Mappings between Channel ID: string --> TextChannelInfo
    rolesNoMod?: string[]                       // Discord Roles that are not moderated by the Bot
    rolesCanCmd?: string[]                      // Discord Roles that can command Bot
}

export interface TextChannelInfo {
    calendarId: string,                         // Required public Google Calendar ID
    name?: string,                              // Name of the channel (for printing purposes only)
    msgSelfDeleteMilSec?: number,               // Completely Override msgSelfDeleteMilSec in ConfigInfo
    rolesNoMod?: string[]                       // Completely Override rolesNoMod in ConfigInfo
    rolesCanCmd?: string[]                      // Completely Override rolesCanCmd in ConfigInfo
}
