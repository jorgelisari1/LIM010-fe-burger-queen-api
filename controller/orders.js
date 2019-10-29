/* eslint-disable require-atomic-updates */
const order = require('../model/modelOrders')
const products = require('../model/modelProducts');
// const pagination = require('../utils/pagination');
const mongodb = require('mongodb');

module.exports.postOrders = async (req, resp, next) => {
    if (!req.body.products || req.body.products.length === 0) {
        //no se indica `userId` o se intenta crear una orden sin productos
        return next(400);
    }
    let newOrder = new order();
    newOrder.dateEntry = Date.now();
    newOrder.userId = req.headers.user._id;
    newOrder.client = req.body.client;
    const arrProducts = await products.find({ _id: { $in: req.body.products.map(pId => mongodb.ObjectId(pId.product)) } })
    if (arrProducts.length !== req.body.products.length) {
        req.body.products = req.body.products.filter((x) => {
            //filtra todos los productos que sean diferentes de null
            return x !== null || undefined;
        })
    }
    const allProducts = req.body.products.map((currentProduct, index) => ({
        product: {
            _id: currentProduct.product,
            name: arrProducts[index].name,
            price: arrProducts[index].price,
        },
        qty: currentProduct.qty
    }));

    newOrder.products = allProducts;
    const orderStored = await newOrder.save();
    return resp.send(orderStored)
};

