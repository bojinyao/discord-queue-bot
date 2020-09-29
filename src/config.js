require('dotenv').config();

const OHQueueID = process.env.QUEUE_CHANNEL_ID;

const Config = {
    msgSelfDeleteMilSec: 10000,

    channels: {
        [OHQueueID]: {
            name: "oh-queue",
            channel: null,
        }
    }
    
}

exports.Config = Config;
