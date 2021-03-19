const fs = require('fs');

const privKey = fs.readFileSync('/etc/letsencrypt/live/fbgclips.com/privkey.pem');
const cert = fs.readFileSync('/etc/letsencrypt/live/fbgclips.com/fullchain.pem')
const ca = fs.readFileSync('/etc/letsencrypt/live/fbgclips.com/chain.pem')
module.exports = {
    options: {
        key: privKey,
        cert: cert,
        ca: ca
    }
}

