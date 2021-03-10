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
            user.send('test');
        }
    }
    catch (err) {
        console.error(err);
    }
}


module.exports = {
    notifyClipPosted
}