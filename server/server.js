const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

const webhooks = require('./routes/webhooks');

app.use(morgan('tiny'))


app.get('/', (req, res) => {
    res.send('hello world');
});


app.use('/webhooks', (req, res) => {

    if (req.query['hub.mode'] == 'subscribe' 
        && req.query['hub.verify_token'] == 'SuperSecretToken'
    ) {
        res.send(req.query['hub.challenge']);
    }
    else {
        res.sendStatus(400);
    }
}); 


app.listen(port, () => {
    console.log('listening on port' + port);
})