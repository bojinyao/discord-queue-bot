// ---------------------------- Config ENV first ---------------------------- //
require('dotenv').config();
// ----------------------------- regular imports ---------------------------- //
import Discord = require('discord.js');
import { api } from './googleAPI';
import { Config } from '../bot-config';
import { BotCache } from './internal';

// -------------------------------------------------------------------------- //
// --------------------------------- Discord -------------------------------- //
// -------------------------------------------------------------------------- //
const client = new Discord.Client();
const botCache: BotCache = {};


client.on('ready', async () => {
    if (client.user) {
        console.log(`Connected as ${client.user.tag}`);
    } else {
        console.log(`Connected as bot!`);
    }

    for (const [id, chan] of Object.entries(Config.channels)) {
        let channel = client.channels.cache.get(id);
        // necessary hack: https://github.com/discordjs/discord.js/issues/3622#issuecomment-565550605
        if (channel && channel.type === 'text') {
            botCache.id = (channel as Discord.TextChannel);
            let msg = await botCache.id.send("Connection Successful! (msg will self destruct)");
            msg.delete({ timeout: chan.msgSelfDeleteMilSec ?? Config.msgSelfDeleteMilSec })
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
    // check if TextChannel
    if (message.channel.type !== 'text') return;

    if (chan.type === 'queue') {
        // Check if person in role not moderated
        if (message.member) {
            for (let [_, role] of message.member.roles.cache) {
                // existence of channel's rolesNoMod overrides Config's
                if (chan.rolesNoMod) {
                    if (chan.rolesNoMod.includes(role.name)) return;
                } else {
                    if (Config.rolesNoMod?.includes(role.name)) return;
                }
            }
        }

        let createdDate = message.createdAt;
        let validMsg = await hasEventNow(createdDate, chan.calendarId)
            .catch(console.error);

        if (!validMsg) {
            // delete the invalid message
            message.delete().catch(console.error);
            // reply with reason, then delete the reason message
            let msg = await message.reply('No scheduled event right now (msg will self destruct)');
            msg.delete({ timeout: chan.msgSelfDeleteMilSec ?? Config.msgSelfDeleteMilSec }).catch(console.error);
        }
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
