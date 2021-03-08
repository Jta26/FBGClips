const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FVargothaFaye%2Fvideos%2F285747612939172%2F&width=0';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0'
    }
}



const scrape = async () => {
    return axios.get(url).then((response) => {
        const $ = cheerio.load(response.data);
        console.log($('video'));
        return response;
    });
}

module.exports = {
    scrape
}