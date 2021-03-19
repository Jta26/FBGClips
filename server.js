const dotenv = require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const morgan = require('morgan');
const xhub = require('express-x-hub');
const session = require('express-session');
const app = express();
const port = process.env.FBGC_PORT || 3000;
const passport = require('passport');

const discordBot = require('./services/discordbot');

app.set('view engine', 'ejs');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc:['self', 'facebook.com', 'www.facebook.com']
        }
    }
}));
app.use(session({secret:process.env.FB_CLIENT_SECRET, resave: true, saveUninitialized: true}));
app.use(xhub({ algorithm: 'sha1', secret: process.env.FB_CLIENT_SECRET }));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(passport.initialize());
app.use(passport.session());

const webhooks = require('./routes/webhooks');
const vods = require('./routes/VoDs');
const auth = require('./routes/auth');
const posts = require('./routes/posts');

app.get('/', async (req, res) => {
    res.send('hello world');
});

app.use('/auth', auth);
app.use('/webhooks', webhooks);
app.use('/vods', vods);
app.use('/posts', posts);

app.listen(port, () => {
    console.log('HTTP server listening on port ' + port);
});
