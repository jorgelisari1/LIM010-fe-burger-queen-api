const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const products = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,          
    },
    image: {
        type: String,
        required: false
    },
    type: {
        type: Object,
        required: false
    },
    dateEntry: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model('Products', products);