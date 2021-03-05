
const express = require('express');
const router = express.Router();

const FB_WEBHOOK_TOKEN = process.env.token;

router.get('/', (req, res) => {
    res.send('webhooks page');
});


router.post('/facebook', (req, res) => {
    if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == FB_WEBHOOK_TOKEN) {
        res.send(req.query['hub.challenge']);
    }
    else {
        // handle the web hook if there is a valid body
        console.log(req.body);
    }
})



module.exports = router;