require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const xhub = require('express-x-hub');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

const passport = require('passport');


app.set('view engine', 'ejs');

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(session({secret:process.env.FB_WEBHOOK_TOKEN, resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

const webhooks = require('./routes/webhooks');
const vods = require('./routes/VoDs');
const auth = require('./routes/auth');

app.get('/', async (req, res) => {
    res.send('hello world');
});

app.use('/webhooks', webhooks); 
app.use('/vods', vods);
app.use('/auth', auth);

app.listen(port, () => {
    console.log('listening on port ' + port);
})