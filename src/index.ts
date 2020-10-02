// ---------------------------- Config ENV first ---------------------------- //
require('dotenv').config();
// ----------------------------- regular imports ---------------------------- //
import Discord = require('discord.js');
import { api } from './googleAPI';

// ------------------------------- Interfaces ------------------------------- //
interface ConfigInfo {
    msgSelfDeleteMilSec: number,
    channels: Record<string, TextChannelInfo>
}

interface TextChannelInfo {
    name?: string,
    channel?: Discord.TextChannel,
    calendarId: string
}

// ------------------------------ Configuration ----------------------------- //
const OHQueue: TextChannelInfo = {
    name: 'oh-queue',
    calendarId: 'berkeley.edu_k2g60q1sehd2u0ujd257jqm7h0@group.calendar.google.com'
}

const LabQueue: TextChannelInfo = {
    name: 'lab-queue',
    calendarId: 'berkeley.edu_d358eocqj23pak3atie23vk35o@group.calendar.google.com'
}

const Config: ConfigInfo = {
    msgSelfDeleteMilSec: 10000,

    channels: {
        "747247932033597531": OHQueue,
        "747244970108387409": LabQueue
    }

}

// -------------------------------------------------------------------------- //
// --------------------------------- Discord -------------------------------- //
// -------------------------------------------------------------------------- //
const client = new Discord.Client();

client.on('ready', async () => {
    if (client.user) {
        console.log(`Connected as ${client.user.tag}`);
    } else {
        console.log(`Connected as bot!`);
    }
    
    for (const [id, chan] of Object.entries(Config.channels)) {
        let channel = client.channels.cache.get(id)

        if (channel && channel.type === 'text') {
            // necessary hack: https://github.com/discordjs/discord.js/issues/3622#issuecomment-565550605
            chan.channel = (channel as Discord.TextChannel);
            let msg = await chan.channel.send("Connection Successful! (msg will self destruct)");
            msg.delete({ timeout: Config.msgSelfDeleteMilSec })
                .catch(console.error);
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
        .catch(console.error);

    if (!validMsg) {
        // delete the invalid message
        message.delete().catch(console.error);
        // reply with reason, then delete the reason message
        let msg = await message.reply('No scheduled event right now (msg will self destruct)');
        msg.delete({ timeout: Config.msgSelfDeleteMilSec }).catch(console.error);
    }

})

// ---------------------------- helper functions ---------------------------- //

let hasEventNow = async (date: Date, calendarId: String) => {
    let tMin = new Date(date.getTime());
    tMin.setSeconds(tMin.getSeconds() - 1);

    let tMax = new Date(date.getTime());
    tMax.setSeconds(tMax.getSeconds() + 1);

    let params = {
        calendarId: calendarId,
        timeMin: tMin,
        timeMax: tMax
    }
    let res = await api.events.list(params);
    return res.data.items.length > 0;
}

// --------------------- this needs to be at the bottom --------------------- //
client.login(process.env.BOT_TOKEN);
