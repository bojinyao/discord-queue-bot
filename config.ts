const OHQueueID = process.env.OH_QUEUE_CHANNEL_ID!;
const LabQueueID = process.env.LAB_QUEUE_CHANNEL_ID!;

const Config = {
    msgSelfDeleteMilSec: 10000,

    channels: {
        [OHQueueID]: {
            name: 'oh-queue',
            channel: null,
            calendarId: 'berkeley.edu_k2g60q1sehd2u0ujd257jqm7h0@group.calendar.google.com'
        },
        [LabQueueID]: {
            name: 'lab-queue',
            channel: null,
            calendarId: 'berkeley.edu_d358eocqj23pak3atie23vk35o@group.calendar.google.com'
        }
    }
    
}

export { Config };
