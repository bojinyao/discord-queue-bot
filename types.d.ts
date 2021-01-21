import Discord = require('discord.js');
// ------------------------------- Interfaces ------------------------------- //
export default interface ConfigInfo {
    guilds: string[],                           // Array of Discord server IDs
    msgSelfDeleteMilSec: number,                // Number of milliseconds before a message self destructs
    textChannels: Record<string, TextChannelInfo>,  // Mappings between Channel ID: string --> TextChannelInfo
    canvas?: CanvasInfo                         // Course Number of Canvas class instance
}

interface TextChannelInfo {
    calendarId: string                          // [Required] Public Google Calendar ID
    name?: string,                              // [Recommended] Name of the channel (for printing purposes only)
    channel?: Discord.TextChannel,              // No need to provide this during obj declaration
    msgSelfDeleteMilSec?: number,               // Override msgSelfDeleteMilSec in ConfigInfo 
}

interface CanvasInfo {
    courseNum: string,                          // Course Number on Canvas
    welcomeDM?: string,                          // DM to send to each new user
    rolesMappings?: CanvasRolesMappingInfo      // Mapping from Canvas roles to Discord Roles
}

interface CanvasRolesMappingInfo {
    defaultRoleIDs?: string[],                    // role IDs to assign to everyone as default
    studentRoleIDs?: string[],                    // role IDs to assign to Canvas students
    waitListStudentRoleIDs?: string[],            // role IDs to assign to Canvas wait-list students
    teacherRoleIDs?: string[],                    // role IDs to assign to Canvas teachers
    TARoleIDs?: string[],                         // role IDs to assign to Canvas TAs
    leadTARoleIDs?: string[],                     // role IDs to assign to Canvas Lead TAs
    readerRoleIDs?: string[],                     // role IDs to assign to Canvas readers
    designerRoleIDs?: string[],                   // role IDs to assign to Canvas designers
    observerRoleIDs?: string[]                    // role IDs to assign to Canvas observers
}
