const express = require('express');
const router = express.Router();
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const axios = require('axios');
const txtWriter = require('../services/txtWriter');

passport.use(new Strategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URL,
}, async (accessToken, refreshToken, user, callback) => {
    // if the user id is me
    // prevents other people from writing new access tokens.
    if (user.id == process.env.USER_ID) {
        const LLUserAccessToken = await getLongLivedUserAccessToken(accessToken);
        const LLPageAccessToken = await exchangeLLUserTokenForLLPageToken(LLUserAccessToken, user);
        txtWriter.writeAccessToken(LLPageAccessToken);
    }
    return callback(null, user);
}));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((obj, callback) => {
    callback(null, obj);
});

const getLongLivedUserAccessToken = async (shortLivedUserToken) => {
    const url = `https://graph.facebook.com/v10.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FB_CLIENT_ID}&client_secret=${process.env.FB_CLIENT_SECRET}&fb_exchange_token=${shortLivedUserToken}`;
    const payload = await axios.get(url);
    return payload.data.access_token;
}

const exchangeLLUserTokenForLLPageToken = async (LLUserAccessToken, user) => {
    const url = `https://graph.facebook.com/v10.0/${user.id}/accounts?access_token=${LLUserAccessToken}`;
    const payload = await axios.get(url);
    const gamingPage = payload.data.data.filter((obj) => {
        return obj.id == process.env.PAGE_ID;
    });
    if (gamingPage[0] != null) {
        return gamingPage[0].access_token;
    }
}

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/return', 
    passport.authenticate('facebook', {failureRedirect: '/auth/login_failed' }), 
    async (req, res) => {
        const code = req.query.code;
        if (code != null) {
            res.send('Successfully Authenticated to Facebook!');
        }
        else {
            res.sendStatus(404);
        }
    }
);

router.get('/clearAuth', (req, res) => {
    txtWriter.clearAccessToken();
    res.sendStatus(200);
})

module.exports = router;