const express = require('express');
const router = express.Router();

const FBAPIService = require('../services/facebook');


router.get('/:id', async (req, res) => {
    const objectID = req.params.id;
    // Query the Graph API Here for the item at the ID in the url parameter.
    console.log(objectID);
    const queryResult = await FBAPIService.queryPost(objectID);
    if (queryResult != null) {
        res.render('metaEmbeds', queryResult);
    }
    else {
        // render the video not found page.
        res.status(404).send('post not found');
    }
});




module.exports = router;