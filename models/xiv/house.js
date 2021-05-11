const mongoose = require('mongoose');

    // {
    //     locale: "Shirogane" | "Mist" | "Goblet" | "Lavendar Beds",
    //     wardNumber: Number,
    //     plotNumber: Number,
    //     plotSize: "Small" | "Medium" | "Large",
    //     price: "3,187,187 Gil"
    // }

const houseSchema = new mongoose.Schema({
    locale: {type: String, enum: ['Shirogane', 'Mist', 'Lavendar Beds', 'Goblet']},
    wardNumber: Number,
    plotNumber: Number,
    plotSize: {type: String, enum: ['Small', 'Medium', 'Large']},
    allOpenSightings: {
        type: [{
            date: Date, 
            price: Number
        }]
    }
});
houseSchema.index({locale: 1, wardNumber: 1, plotNumber: 1}, { unique: true})
const houseModel = mongoose.model('House', houseSchema);

module.exports = houseModel;