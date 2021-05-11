const express = require('express');
const router = express.Router();

const housingDB = require('../../services/xiv/housingDB');

router.post("/add", async (req, res) => {
    // should take in a house object json as the body and store it in a database.
    // the body should look like this
    // {
    //     locale: "Shirogane" | "Mist" | "Goblet" | "Lavendar Beds",
    //     wardNumber: Number,
    //     plotNumber: Number,
    //     plotSize: "Small" | "Medium" | "Large",
    //     price: "3,187,187 Gil"
    // }
    const house = req.body;
    if (house.secret != process.env.FFXIVDB_PASSWORD) {
        res.send(403).json({status: 304, message: "Access Denied"});
    }
    if (house != null) {
        const isHouseAdded = await housingDB.addHouse(house)
        if (isHouseAdded) {
            res.status(204).json({status: 204, message: 'House Recorded Successfully'});
        }
        else {
            res.status(500).json({status: 500, message: 'There was a problem adding the house.'});
        }
    }
});


module.exports = router;