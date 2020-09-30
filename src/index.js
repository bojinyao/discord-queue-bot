// Config ENV first
require('dotenv').config();
const { Config } =require('../config.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const { google } = require('googleapis');

// Basically access permission for this service.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.JWT({
    email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    keyId: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    scopes: SCOPES
});


const api = google.calendar({version : "v3", auth : auth});
const calendarIDs = [
    'berkeley.edu_k2g60q1sehd2u0ujd257jqm7h0@group.calendar.google.com', // OH calendar
    'berkeley.edu_d358eocqj23pak3atie23vk35o@group.calendar.google.com', // Lab calendar
]

let hasEventNow = (date, calendarId) => {
    let tMin = new Date(date.getTime());
    tMin.setSeconds(tMin.getSeconds() - 1);

    let tMax = new Date(date.getTime());
    tMax.setSeconds(tMax.getSeconds() + 1);

    let params = {
        calendarId : calendarId,
        timeMin: tMin,
        timeMax: tMax
    }
    api.events.list(params)
        .then(res => {
            console.log(res.data.items.length);
            return res.data.items.length > 0;
        })
        .catch(err => {
            console.log(err);
            // if something is wrong, try not to obstruct anything
            return true
        });
}


client.on('ready', async () => {
    console.log(`Connected as ${client.user.tag}`);

    for (const [id, chan] of Object.entries(Config.channels)) {
        chan.channel = client.channels.cache.get(id);
        chan.channel.send("Connection Successful! (msg will self destruct)")
            .then(msg => {
                msg.delete({ timeout: Config.msgSelfDeleteMilSec });
            })
            .catch(err => {
                console.log(err);
            });
    }
})

client.on('message', (message) => {
    // check if message is a bot
    if (message.author.bot) return;
    // check for relevant channel
    if (!Config.channels[message.channel.id]) return;
    
    let createdDate = message.createdAt;
    createdDate = new Date('2020-09-29T11:20:01-07:00');
    let validMsg = hasEventNow(createdDate, 'berkeley.edu_k2g60q1sehd2u0ujd257jqm7h0@group.calendar.google.com');
    console.log(validMsg);
    if (! validMsg) {
        message.reply('No scheduled event right now (msg will self destruct)')
            .then(msg => {
                msg.delete({ timeout: Config.msgSelfDeleteMilSec })
            })
            .catch(err => {
                console.log(err);
            });
        message.delete();
    }
    
})

client.login(process.env.BOT_TOKEN);
