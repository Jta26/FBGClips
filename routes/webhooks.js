const express = require('express');
const router = express.Router();
const discordBotService = require('../services/discordbot');


const FB_WEBHOOK_TOKEN = process.env.FB_WEBHOOK_TOKEN;


router.get('/', (req, res) => {
    res.send('webhooks page');
});


router.get('/facebook', (req, res) => {
    if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == FB_WEBHOOK_TOKEN) {
        res.send(req.query['hub.challenge']);
    }
    else {
        res.sendStatus(400);
    }
});

router.post('/facebook', (req, res) => {
    if (!req.isXHubValid()) {
        res.sendStatus(401);
    }
    
    discordBotService.notifyClipPosted(req.body);
    res.sendStatus(200);
});



module.exports = router;