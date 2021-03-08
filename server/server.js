require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const embedScraper = require('./services/embedscraper');
const xhub = require('express-x-hub');

const app = express();
const port = process.env.PORT || 3000;

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(express.json());

app.use(express.static('public'));

const webhooks = require('./routes/webhooks');

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', async (req, res) => {
    res.send('hello world');
});

app.use('/webhooks', webhooks); 

app.listen(port, () => {
    console.log('listening on port' + port);
})