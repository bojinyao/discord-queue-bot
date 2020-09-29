const { Config } =require('./config.js');
const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
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
    // check for relevant channel
    if (!Config.channels[message.channel.id]) return;
    
    let createdDate = message.createdAt;
    if (true) {
        if (message.content === 'hello') {
            message.reply('No "Hello" allowed in here (msg will self destruct)')
                .then(msg => {
                    msg.delete({ timeout: Config.msgSelfDeleteMilSec })
                })
                .catch(err => {
                    console.log(err);
                });
            message.delete();
        }
    }
    
})

client.login(process.env.BOT_TOKEN);
