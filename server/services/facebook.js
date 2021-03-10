const axios = require('axios');

const txtWriter = require('../services/txtWriter');

// this is where we will query the graph api for a post or video

// these will organize the data into digestable objects for each type.
const queryVideo = async (videoId) => {
    const videoFields = [
        'title',
        'description',
        'permalink_url',
        'format',
        'privacy',
        'published',
        'picture'
    ]
    let queryResults = await makeQuery(videoId, videoFields);

    if (queryResults == null) {
        return null;
    }
    queryResults = handleNoPicture(queryResults);
    return queryResults;
}

const queryPost = (postId) => {

}

// makes a request against the api for the object id.
// example: "graph.facebook.com/{object-id}?fields={all the fields}"
const makeQuery = async (objectId, fields) => {
    const accessToken = txtWriter.readAccessToken();
    const url = `https://graph.facebook.com/${objectId}?fields=${fields.join(',')}&access_token=${accessToken}`;

    try {
        const payload = await axios.get(url);
        if (payload.data) {
            return payload.data;
        }
    }
    catch (err) {
        if (err.response.data.error.message) {
            console.error(err.response.status, err.response.statusText, err.response.data.error.message);
        }
        return null;
    }
}

const handleNoPicture = (queryResult) => {
    if (!queryResult.format[0].picture) {
        queryResult.format = [
            {
                picture: 'https://scontent.fagc1-2.fna.fbcdn.net/v/t1.0-9/157260453_249967856782196_7128383187999542663_o.jpg?_nc_cat=102&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=uU8VkjCLRYIAX8Wkjc4&_nc_ht=scontent.fagc1-2.fna&oh=7cccf38a8c2506e9995efebd8f178129&oe=606E5182'
            }
        ]
    }
    return queryResult;
}

module.exports = {
    queryVideo,
    makeQuery
}