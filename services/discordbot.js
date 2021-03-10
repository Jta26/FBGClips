const Discord = require('discord.js');
const bot = new Discord.Client();
bot.login(process.env.DISCORD_BOT_TOKEN);



bot.on('ready', () => {
    console.log('Discord Bot Connected Successfully');
});

const notifyClipPosted = async (video) => {
    try {
        console.log(process.env.DISCORD_USER_ID);
        const user = await bot.users.fetch(process.env.DISCORD_USER_ID);
        if (user) {
            user.send(JSON.stringify(video));
        }
    }
    catch (err) {
        console.error(err);
    }
}


const assembleNotification = (body) => {
    // If a new video was posted.
    if (body.field == "videos") {
        const videoId = body.value.id;
        

    }
    else if (body.field == 'live_videos') {

    }
    else if (body.field == 'feed') {

    }
    else {
        // unknown post type
    }
}

const shouldNotify = (body) => {

    if (body.field == "videos") {

    }
    else if (body.field == 'live_videos') {

    }
    else if (body.field == 'feed') {

    }
    else {
        // unknown post type
    }


}


module.exports = {
    notifyClipPosted
}