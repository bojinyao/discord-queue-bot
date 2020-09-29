require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`);

    let OHQueueChannel = client.channels.cache.get(process.env.QUEUE_CHANNEL_ID);
    
})



client.login(process.env.BOT_TOKEN);
