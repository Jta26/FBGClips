const fs = require('fs');

const writeAccessToken = (token) => {
    fs.writeFile('ACT.txt', token, (err) => {
        if (err) return console.log(err);
        console.log('wrote access token to txt file');
    });
}

const readAccessToken = () => {
    try {
        const data = fs.readFileSync('ACT.txt');
        return data;
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = {
    writeAccessToken,
    readAccessToken
}