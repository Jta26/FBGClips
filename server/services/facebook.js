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
    queryResults = handleNoDescription(queryResults);
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
                picture: process.env.DEFAULT_PICTURE
            }
        ]
    }
    return queryResult;
}

const handleNoDescription = (queryResult) => {
    if (!queryResult.description) {
        queryResult.description = process.env.DEFAULT_DESCRIPTION;
    }
    return queryResult;
}

module.exports = {
    queryVideo,
    makeQuery
}