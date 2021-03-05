require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

const webhooks = require('./routes/webhooks');

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))


app.get('/', (req, res) => {
    res.send('hello world');
});


app.use('/webhooks', webhooks); 


app.listen(port, () => {
    console.log('listening on port' + port);
})