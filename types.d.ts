import Discord = require('discord.js');
// ------------------------------- Interfaces ------------------------------- //
export default interface ConfigInfo {
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
    welcomeDM: string,                          // DM to send to each new user
    rolesMappings?: CanvasRolesMappingInfo      // Mapping from Canvas roles to Discord Roles
}

interface CanvasRolesMappingInfo {
    defaultRoles?: string[],                    // roles to assign to everyone as default
    studentRoles?: string[],                    // roles to assign to Canvas students
    waitListStudentRoles?: string[],            // roles to assign to Canvas wait-list students
    teacherRoles?: string[],                    // roles to assign to Canvas teachers
    TARoles?: string[],                         // roles to assign to Canvas TAs
    leadTARoles?: string[],                     // roles to assign to Canvas Lead TAs
    readerRoles?: string[],                     // roles to assign to Canvas readers
    designerRoles?: string[],                   // roles to assign to Canvas designers
    observerRoles?: string[]                    // roles to assign to Canvas observers
}
