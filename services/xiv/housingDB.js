const mongoose = require('mongoose');
const houseModel = require('../../models/xiv/house');

const dbName = process.env.XIVDB_DBNAME
const dbUser = process.env.XIVDB_USER;
const dbPassword = process.env.XIVDB_PASSWORD;
const dbHost = process.env.XIVDB_HOST;

mongoose.connect(`mongodb://${dbUser}:${dbPassword}@${dbHost}/${dbName}`, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error Connecting to FFXIV Housing Database.'));

db.once('open', function() {
    console.log('connected to FFXIV Housing Database.');
});

const addHouse = async (house) => {
    console.log(house)
    const filter = {
        locale: house.locale,
        wardNumber: house.wardNumber,
        plotNumber: house.plotNumber,
    }
    let houseObj = await houseModel.findOne(filter)
    if (houseObj != null) {
        // if the house already exists, add a sighting to it's allOpenSightings.
        const newSighting = {
            date: new Date(),
            price: convertPriceToNumber(house.price)
        }
        houseObj.allOpenSightings.push(newSighting);
        houseObj.save(function(err) {
            if (err) {
                console.error('Error inserting into ffxiv housing database.', house);
            }
        });
    }
    else {
        // the house was not found, create it
        // as this is the first time seeing this house open.
        houseObj = await new houseModel({
            locale: house.locale,
            wardNumber: house.wardNumber,
            plotNumber: house.plotNumber,
            plotSize: house.plotSize,
            allOpenSightings: [{
                    date: new Date(),
                    price: convertPriceToNumber(house.price)
            }]
        })
        houseObj.save(function(err) {
            if (err) {
                console.error('Error inserting into ffxiv housing database.', house);
            }
        });
    }
}

const convertPriceToNumber = (priceString) => {
    const numberString = parseInt(priceString.split(' ')[0].replace(/,/g,''));
    return numberString;
}


module.exports = {
    addHouse,
}