// ---------------------------- Config ENV first ---------------------------- //
require('dotenv').config();
// ----------------------------- regular imports ---------------------------- //
import Discord = require('discord.js');
import { api } from './googleAPI';
import { Config } from '../bot-config';
import { calendar_v3 } from 'googleapis';
// import { find } from 'lodash';
import Canvas from './canvas/canvas';
import { TextChannelInfo } from '../types';

// -------------------------------------------------------------------------- //
// --------------------------------- Discord -------------------------------- //
// -------------------------------------------------------------------------- //
const client = new Discord.Client();

var GET_CACHE: any[] = [];
var GET_CACHE_LAST_UPDATE: Date = new Date();
const GET_CACHE_UPDATE_TIMELAPSE = 60000;
const canvas = new Canvas(
    "https://bcourses.berkeley.edu",
    process.env.CANVAS_ACCESS_TOKEN
);

// -------------------------- When Bot Comes Online ------------------------- //
client.on('ready', async () => {
    // Connect with Discord
    if (client.user)
        console.log(`Connected as ${client.user.tag}`);
    else
        console.log(`Connected as bot!`);

    for (const [id, tcInfo] of Object.entries(Config.textChannels)) {
        let channel = client.channels.cache.get(id)

        if (channel && channel.type === 'text') {
            // necessary hack: https://github.com/discordjs/discord.js/issues/3622#issuecomment-565550605
            tcInfo.channel = (channel as Discord.TextChannel);
            let msg = await tcInfo.channel.send("Connection Successful! (msg will self destruct)");
            msg.delete({ timeout: tcInfo.msgSelfDeleteMilSec ?? Config.msgSelfDeleteMilSec })
                .catch(console.error);
        }
    }

    // Connect with Canvas if needed and update cache
    if (Config.canvas) {
        try {
            let res = await canvas.get(`courses/${Config.canvas.courseNum}/users`, {
                params: {
                    'sort': 'email',
                    'enrollment_type': 'student'
                }
            });
            GET_CACHE = res;
            GET_CACHE_LAST_UPDATE = new Date();

            // Try to verify students already joined the server(s)
            Config.guilds.forEach(async (guildId) => {
                let curGuild = await client.guilds.fetch(guildId);
                if (curGuild.available) {
                    let members = await curGuild.members.fetch();
                    members.forEach(member => {
                        if (member.roles.cache.size === 0) {
                            // student has no role and need to be contacted to assigned roles
                            contactUser(member);
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
})

/**
 * Initiate a DM with an user
 * @param member member to contact
 */
let contactUser = async (member: Discord.GuildMember | Discord.PartialGuildMember) => {
    if (Config.canvas && Config.canvas.welcomeDM) {
        await member.send(Config.canvas.welcomeDM).catch(console.error);
    }
}

// ------------------------ When Any Message is Sent ------------------------ //
client.on('message', async (message) => {
    // check if message is a bot
    if (message.author.bot) return;
    /* 
    Bot's functionality is separated into types of channel
    */
    switch (message.channel.type) {
        case 'text': {
            // check for relevant text channel
            let channel = Config.textChannels[message.channel.id];
            if (channel) {
                handleTextChannelMessage(channel, message);
            }
            break;
        }
        case 'dm': {
            handleDM(message);
            break;
        }
        default: {
            break;
        }
    }
})

/**
 * 
 * @param channelInfo 
 * @param message 
 * @returns true if no error, false if some error was raised
 */
let handleTextChannelMessage = async (channelInfo: TextChannelInfo, message: Discord.Message) => {
    try {
        let createdDate = message.createdAt;
        let validMsg = await hasEventNow(createdDate, channelInfo.calendarId);;

        if (!validMsg) {
            // delete the invalid message after 1 sec
            message.delete({ timeout: 1000 });
            // reply with reason, then delete the reason message
            let msg = await message.reply('No scheduled event right now (msg will self destruct)');
            msg.delete({ timeout: channelInfo.msgSelfDeleteMilSec ?? Config.msgSelfDeleteMilSec });
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

let handleDM = async (message: Discord.Message) => {

}

let verifyMember = async (member: Discord.GuildMember) => {

    /*
    // https://stackoverflow.com/questions/49599732/add-user-to-role-with-newest-discord-js
    let verifiedRole = guildMember.guild.roles.cache.find(role => role.name === 'verified');
    if (verifiedRole) {
        guildMember.roles.add(verifiedRole);
    }
    let studentsRole = guildMember.guild.roles.cache.find(role => role.name === 'students');
    if (studentsRole) {
        guildMember.roles.add(studentsRole);
    }
    */
}

let assignRolesToUser = async (roles: string[], member: Discord.GuildMember) => {

}

// ----------------------- When A Person Joins Server ----------------------- //
client.on('guildMemberAdd', async (guildMember) => {
    // don't send DM to bot or non-existent user
    if (guildMember.user?.bot ?? true) return;
    contactUser(guildMember);
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
    return (res.data.items?.length ?? 1) > 0;
}

// --------------------- this needs to be at the bottom --------------------- //
client.login(process.env.BOT_TOKEN);
