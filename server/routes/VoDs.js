const express = require('express');
const router = express.Router();


// This is the data returned from the webhook when I make a post or a video.
const exampleWebhookVideoPayload = {
    "object": "page",
    "entry": [{
        "id": "441882280202022",
        "time": 1615225828,
        "changes": [{
            "value": {
                "from": {
                    "id": "441882280202022",
                    "name": "Vargotha"
                },
                "message": "E12S Lions Prog [Aether] [Sargatanas]",
                "post_id": "441882280202022_769433863995162",
                "created_time": 1615225818,
                "item": "status",
                "published": 1,
                "verb": "edited"
            },
            "field": "feed"
        }]
    }]
}

// This is the response from the Graph API afte querying for the ID found in the webhook payload.
// "/441882280202022?fields=title,permalink_url,description,thumbnails.limit(10){uri}" <- GRAPH API Query
const exampleGraphAPIPayload = {
    "title": "E12S Lions Prog [Aether] [Sargatanas]",
    "permalink_url": "/VargothaFaye/videos/441882280202022/",
    "description": "E12S Lions Prog [Aether] [Sargatanas]",
    "id": "441882280202022",
    "thumbnails": {
        "data": [
            {
                "uri": "https://scontent.fagc1-2.fna.fbcdn.net/v/t15.5256-10/146549152_441882353535348_919298320009952661_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=f2c4d5&_nc_ohc=zrgFGIgPZdQAX9JShbs&_nc_ht=scontent.fagc1-2.fna&oh=6e3f63fad4412d843d316849942ee5ca&oe=606AB1AD",
                "id": "441882350202015"
              },
              //...
        ]
    }
}


// Visiting a video by it's video ID from Facebook will deliver and EJS page templated with 
// meta tags that make sense when linking on other websites.
router.get('/:id', (req, res) => {
    const objectID = req.params.id;
    // Query the Graph API Here for the item at the ID in the url parameter.
    // const payload = await FacebookAPIService.getPayload(objectID);

    res.render('metaEmbeds', exampleGraphAPIPayload);

});





module.exports = router;