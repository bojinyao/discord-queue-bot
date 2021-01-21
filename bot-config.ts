// DO NOT CHANGE import
import ConfigInfo from './types';
// ------------------------------ Configuration ----------------------------- //
export const Config: ConfigInfo = {
    guilds: ["760561954585575455"],
    msgSelfDeleteMilSec: 10000,

    textChannels: {
        "760563080404533248": {
            name: 'oh-queue',
            calendarId: 'berkeley.edu_k2g60q1sehd2u0ujd257jqm7h0@group.calendar.google.com',
        },
        "760753891343204352": {
            name: 'lab-queue',
            calendarId: 'berkeley.edu_d358eocqj23pak3atie23vk35o@group.calendar.google.com'
        }
    },

    canvas: {
        courseNum: "1502093",
        welcomeDM: "Welcome to CS10 Server! Please reply with your SID to get verified (this might take a minute)",
        rolesMappings: {
            defaultRoleIDs: ['799096627473416255'], // verified
            studentRoleIDs: ['799096627473416256']  // students
        }
    },
}
