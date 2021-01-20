// DO NOT CHANGE import
import ConfigInfo from './types';
// ------------------------------ Configuration ----------------------------- //
export const Config: ConfigInfo = {
    canvas: {
        courseNum: "1502093",
        welcomeDM: "Welcome to CS10 Server! Please reply with your SID to get verified (this might take a minute)",
        rolesMappings: {
            defaultRoles: ['verified'],
            studentRoles: ['students'],
            waitListStudentRoles: ['students'],
            TARoles: ['tas'],
            readerRoles: ['readers']
        }
    },
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
    }
}
