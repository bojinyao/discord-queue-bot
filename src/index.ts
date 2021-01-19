// ---------------------------- Config ENV first ---------------------------- //
require('dotenv').config();
// ----------------------------- regular imports ---------------------------- //
import Discord = require('discord.js');
import { api } from './googleAPI';
import { Config } from '../bot-config';
import { calendar_v3 } from 'googleapis';
import Canvas from './canvas/canvas';

// -------------------------------------------------------------------------- //
// --------------------------------- Discord -------------------------------- //
// -------------------------------------------------------------------------- //
const client = new Discord.Client();

client.on('ready', async () => {
    // Connect with Discord
    if (client.user)
        console.log(`Connected as ${client.user.tag}`);
    else
        console.log(`Connected as bot!`);

    for (const [id, tcInfo] of Object.entries(Config.channels)) {
        let channel = client.channels.cache.get(id)

        if (channel && channel.type === 'text') {
            // necessary hack: https://github.com/discordjs/discord.js/issues/3622#issuecomment-565550605
            tcInfo.channel = (channel as Discord.TextChannel);
            let msg = await tcInfo.channel.send("Connection Successful! (msg will self destruct)");
            msg.delete({ timeout: tcInfo.msgSelfDeleteMilSec ?? Config.msgSelfDeleteMilSec })
                .catch(console.error);
        }
    }

    let canvas = new Canvas(
        "https://bcourses.berkeley.edu",
        process.env.CANVAS_ACCESS_TOKEN
    );
    canvas.get('courses/1493756/users');

})

client.on('message', async (message) => {
    // check if message is a bot
    if (message.author.bot) return;
    // check for relevant channel
    let chan = Config.channels[message.channel.id];
    if (!chan) return;

    let createdDate = message.createdAt;
    let validMsg = await hasEventNow(createdDate, chan.calendarId)
        .catch(console.error);

    if (!validMsg) {
        // delete the invalid message after 1 sec
        message.delete({ timeout: 1000 }).catch(console.error);
        // reply with reason, then delete the reason message
        let msg = await message.reply('No scheduled event right now (msg will self destruct)');
        msg.delete({ timeout: chan.msgSelfDeleteMilSec ?? Config.msgSelfDeleteMilSec }).catch(console.error);
    }

})

// ---------------------------- helper functions ---------------------------- //

let hasEventNow = async (date: Date, calendarId: string) => {
    let tMin = new Date(date.getTime());
    tMin.setSeconds(tMin.getSeconds() - 1);

    let tMax = new Date(date.getTime());
    tMax.setSeconds(tMax.getSeconds() + 1);

    let params: calendar_v3.Params$Resource$Events$List = {
        calendarId: calendarId,
        timeMin: tMin.toISOString(),
        timeMax: tMax.toISOString(),
        showDeleted: false,
        singleEvents: true,
    }
    let res = await api.events.list(params);
    // if res data has no items, assume something is there to prevent possible
    // frustration by end user.
    return res.data.items?.length ?? 1 > 0
}

// --------------------- this needs to be at the bottom --------------------- //
client.login(process.env.BOT_TOKEN);
