const Discord = require('discord.js');
const bot = new Discord.Client();
bot.login(process.env.DISCORD_BOT_TOKEN);



bot.on('ready', () => {
    console.log('Discord Bot Connected Successfully');
});

const notifyClipPosted = async (notification) => {
    try {
        const user = await bot.users.fetch(process.env.DISCORD_USER_ID);
        if (user) {
            const embed = makeDiscordEmbed(notification);
            user.send(embed);
        }
    } catch (err) {
        console.error(err);
    }
}

const makeDiscordEmbed = (notification) => {
    const notificationEmbed = new Discord.MessageEmbed().setColor('#2D88FF')
        .setAuthor('Facebook Gaming Clips')
        .setTitle(notification.content)
        .setDescription(notification.message)
        .setImage(notification.image)
        .setURL(notification.fbgclips_url)
        .addFields(
            {name: 'FBG Clips URL', value: notification.fbgclips_url},
            {name: 'Facebook Gaming URL', value: notification.fb_url},
        );

    return notificationEmbed;
}

const notifyMultiple = (posts) => {
    for (let post of posts) {
        const notification = assembleNotification(post);
        notifyClipPosted(notification);
    }
}

const assembleNotification = (post) => {
    if (!post.permalink_url) {
        post.permalink_url = `https://facebook.com/${post.id}`;
    }
    return {
        message: `${post.from.name} just posted to their page.`,
        content: post.message || null,
        fb_url: post.permalink_url,
        fbgclips_url: `https://FBGClips.com/posts/${post.id}`,
        image: post.picture || post.full_picture || null
    }
}



module.exports = {
    notifyClipPosted,
    notifyMultiple
}