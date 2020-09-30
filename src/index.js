// ---------------------------- Config ENV first ---------------------------- //
require('dotenv').config();
// ----------------------------- regular imports ---------------------------- //
const { Config } = require('../config.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const { API } = require('./googleAPI');


// -------------------------------------------------------------------------- //
// --------------------------------- Discord -------------------------------- //
// -------------------------------------------------------------------------- //

client.on('ready', async () => {
    console.log(`Connected as ${client.user.tag}`);

    for (const [id, chan] of Object.entries(Config.channels)) {
        chan.channel = client.channels.cache.get(id);
        if (typeof chan.channel !== 'undefined') {
            chan.channel.send("Connection Successful! (msg will self destruct)")
            .then(msg => {
                msg.delete({ timeout: Config.msgSelfDeleteMilSec })
                        .catch(console.error);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
})

client.on('message', async (message) => {
    // check if message is a bot
    if (message.author.bot) return;
    // check for relevant channel
    let chan = Config.channels[message.channel.id];
    if (!chan) return;
    
    let createdDate = message.createdAt;
    let validMsg = await hasEventNow(createdDate, chan.calendarId)
                            .catch(err => console.log(err));

    if (! validMsg) {
        message.reply('No scheduled event right now (msg will self destruct)')
            .then(msg => {
                msg.delete({ timeout: Config.msgSelfDeleteMilSec })
                        .catch(console.error);
            })
            .catch(err => console.log(err));

        message.delete().catch(console.error);
    }
    
})

// ---------------------------- helper functions ---------------------------- //

let hasEventNow = async (date, calendarId) => {
    let tMin = new Date(date.getTime());
    tMin.setSeconds(tMin.getSeconds() - 1);

    let tMax = new Date(date.getTime());
    tMax.setSeconds(tMax.getSeconds() + 1);

    let params = {
        calendarId : calendarId,
        timeMin: tMin,
        timeMax: tMax
    }
    let res = await API.events.list(params);
    return res.data.items.length > 0;
}

// --------------------- this needs to be at the bottom --------------------- //
client.login(process.env.BOT_TOKEN);
