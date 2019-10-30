const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productsSubcollection = new Schema({
    qty: Number,
    product: Object,
})

const order = new Schema({
    userId: {
        type: String,
    },
    client: {
        type: String,
    },
    products: [productsSubcollection],
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'canceled', 'delivering', 'delivered'],
    },
    dateEntry: {
        type: Date,
        required: true
    },
    dateProcessed: Date,
})
module.exports = mongoose.model('Orders', order);
//module.exports = mongoose.model('subcollectionProducts', productsSubcollection);