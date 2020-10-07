// ------------------------------- Interfaces ------------------------------- //
export interface ConfigInfo {
    msgSelfDeleteMilSec: number,                // Number of milliseconds before a message self destructs
    channels: Record<string, TextQueueChannel | TextCmdChannel>  // Mappings between Channel ID: string --> Text Channel
    rolesNoMod?: string[]                       // Discord Roles that are not moderated by the Bot
    rolesCanCmd?: string[]                      // Discord Roles that can command Bot
}

export interface TextQueueChannel {
    type?: 'queue',                             // type of the interface
    calendarId: string,                         // Required public Google Calendar ID
    name?: string,                              // Name of the channel (for printing purposes only)
    msgSelfDeleteMilSec?: number,               // Completely Override msgSelfDeleteMilSec in ConfigInfo
    rolesNoMod?: string[]                       // Completely Override rolesNoMod in ConfigInfo
    rolesCanCmd?: string[]                      // Completely Override rolesCanCmd in ConfigInfo
}

export interface TextCmdChannel {
    type?: 'command',                           // type of the interface
    name?: string,                              // Name of the channel (for printing purposes only)
    msgSelfDeleteMilSec?: number,               // Completely Override msgSelfDeleteMilSec in ConfigInfo
    rolesCanCmd?: string[]                      // Completely Override rolesCanCmd in ConfigInfo
}
