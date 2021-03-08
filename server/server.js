require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const xhub = require('express-x-hub');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(express.json());

app.use(express.static('public'));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const webhooks = require('./routes/webhooks');
const vods = require('./routes/VoDs');

app.get('/', async (req, res) => {
    res.send('hello world');
});

app.use('/webhooks', webhooks); 
app.use('/vods', vods);

app.listen(port, () => {
    console.log('listening on port' + port);
})