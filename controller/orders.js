/* eslint-disable require-atomic-updates */
const products = require('../model/modelProducts');
const order = require('../model/modelOrders');
// const pagination = require('../utils/pagination');
const mongodb = require('mongodb');

module.exports.postOrders = async (req, resp, next) => {
    try {
        if (!req.body.products || req.body.products.length === 0) {
            //no se indica `userId` o se intenta crear una orden sin productos
            return next(400);
        }
        let newOrder = new order();
        newOrder.dateEntry = Date.now();
        newOrder.userId = req.headers.user._id;
        newOrder.client = req.body.client;

        const arrProducts = await products.find({ _id: { $in: req.body.products.map(pId => mongodb.ObjectId(pId.product)) } })
        console.log('array de products test', arrProducts);
        const allProducts = req.body.products.map((currentProduct, index) => ({
            product: arrProducts.find(p => p._id.equals(currentProduct._id)),
            qty: currentProduct.qty
        }));

        newOrder.products = allProducts;
        const orderStored = await newOrder.save();
        return resp.send(orderStored)
    } catch (error) {
        console.error(error)
    }
}
