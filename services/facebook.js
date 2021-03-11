const axios = require('axios');

// this is where we will query the graph api for a post or video



const queryPost = async (postId) => {
    const postFields = [
        'message',
        'permalink_url',
        'picture',
        'full_picture',
        'privacy',
        'is_published'
    ];

    let queryResults = await makeQuery(postId, postFields);

    if (queryResults == null) {
        return null;
    }
    queryResults = handleNoPicture(queryResults);
    queryResults = handleNoDescription(queryResults);
    if (isPostPrivacyPublic(queryResults)) {

        return queryResults.is_published ? queryResults : null;
    }
}

// makes a request against the api for the object id.
// example: "graph.facebook.com/{object-id}?fields={all the fields}"
const makeQuery = async (objectId, fields) => {
    const accessToken = process.env.FB_PAGE_LL_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/${objectId}?fields=${fields.join(',')}&access_token=${accessToken}`;

    try {
        const payload = await axios.get(url);
        if (payload.data) {
            return payload.data;
        }
    }
    catch (err) {
        if (err.response.data.error.message) {
            console.error(`Error on Graph API query for object ${objectId} and fields [${fields.join(',')}]`);
            console.error(err.response.status, err.response.statusText, err.response.data.error.message);
        }
        return null;
    }
}

const handleNoPicture = (queryResult) => {
    // If there's no full_picture thumbnail, use the full picture
    if (!queryResult.full_picture) {
        // if the picture & full_picture doesn't exist, then use the default.
        if (!queryResult.picture) {
            queryResult.picture = process.env.DEFAULT_PICTURE;
        }
        else {
            queryResult.picture = queryResult.picture;
        }
    }
    return queryResult;
}

const handleNoDescription = (queryResult) => {
    if (!queryResult.description) {
        queryResult.description = process.env.DEFAULT_DESCRIPTION;
    }
    return queryResult;
}


// takes in the body of the request sent from the Facebook webhook and determines which objects are notification worthy.
// generally this is items with the "add" or "edited" verb.
const getIdsToNotify = (body) => {
    const entry = body.entry[0];
    if (entry != null) {
        const toNotify = entry.changes.map((change) => {
            if (change.field == 'feed') {
                // only notify on discord if the entry is published and not "remove" verb.
                if (change.value.verb != 'remove' && change.value.published == 1 && ['status', 'photo'].includes(change.value.item)) {
                    return change.value.post_id;
                }
            }  
        });
        return toNotify;
    }
    return null;
}

const queryIdsToNotify = async (arrIds) => {
    const pagepostFields = [
        'message',
        'full_picture',
        'picture',
        'permalink_url',
        'from',
        'id',
        'privacy',
    ];
    const toNotify = [];
    for (let id of arrIds) {
        const queryResult = await makeQuery(id, pagepostFields);
        if (queryResult != null) {
            if (isPostPrivacyPublic(queryResult)) {
                toNotify.push(queryResult);
            }
        }
    }
    return toNotify;
}

// We probably don't want to share links of posts that are not public.
const isPostPrivacyPublic = (queryResult) => {
    const privacySetting = queryResult.privacy;
    if (privacySetting.value == "EVERYONE" && privacySetting.description == "Public") {
        return true;
    }
}



module.exports = {
    queryPost,
    makeQuery,
    getIdsToNotify,
    queryIdsToNotify
}



    // first we need to get the "entry" value, which is an array with objects
    // example post when a live broadcast is started from streamlabs.
    // {
    //     "object": "page",
    //     "entry": [{
    //         "id": "101259571653026",
    //         "time": 1615416910,
    //         "changes": [{
    //             "value": {
    //                 "from": {
    //                     "id": "101259571653026",
    //                     "name": "Vargotha"
    //                 },
    //                 "message": "Test Broadcast [Aether] [Sargatanas]",
    //                 "post_id": "101259571653026_1130560890795112",
    //                 "created_time": 1615416907,
    //                 "item": "status",
    //                 "published": 0,
    //                 "verb": "add"
    //             },
    //             "field": "feed"
    //         }]
    //     }]
    // }

    // example of a post with just text
    // {
    //     "object": "page",
    //     "entry": [{
    //         "id": "101259571653026",
    //         "time": 1615416579,
    //         "changes": [{
    //             "value": {
    //                 "from": {
    //                     "id": "101259571653026",
    //                     "name": "Vargotha"
    //                 },
    //                 "message": "Test Post plz ignore",
    //                 "post_id": "101259571653026_253689226410059",
    //                 "created_time": 1615416577,
    //                 "item": "status",
    //                 "published": 1,
    //                 "verb": "add"
    //             },
    //             "field": "feed"
    //         }]
    //     }]
    // }
    //example of a post with a picture
    // {
    //     "object": "page",
    //     "entry": [{
    //         "id": "101259571653026",
    //         "time": 1615417087,
    //         "changes": [{
    //             "value": {
    //                 "from": {
    //                     "id": "101259571653026",
    //                     "name": "Vargotha"
    //                 },
    //                 "link": "https://scontent.fagc1-2.fna.fbcdn.net/v/t1.0-9/156868872_253692699743045_18071051086297425_o.jpg?_nc_cat=103&ccb=1-3&_nc_sid=8024bb&_nc_ohc=58saa-zYfC8AX9UkGqa&_nc_ht=scontent.fagc1-2.fna&oh=43e723f1017800def5306ce2ded8e6c4&oe=606D552E%22,%22message%22:%22test image post",
    //                 "post_id": "101259571653026_253692729743042",
    //                 "created_time": 1615417081,
    //                 "item": "photo",
    //                 "photo_id": "253692696409712",
    //                 "published": 1,
    //                 "verb": "add"
    //             },
    //             "field": "feed"
    //         }]
    //     }]
    // }
