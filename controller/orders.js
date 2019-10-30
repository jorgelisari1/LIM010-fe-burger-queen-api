/* eslint-disable require-atomic-updates */
const products = require('../model/modelProducts');
const order = require('../model/modelOrders');
// const pagination = require('../utils/pagination');

module.exports.postOrders = async (req, resp, next) => {
    if (!req.body.products || req.body.products.length === 0) {
        //no se indica `userId` o se intenta crear una orden sin productos
        return next(400);
    }
    let newOrder = new order();
    newOrder.dateEntry = Date.now();
    newOrder.userId = req.headers.user._id;
    newOrder.client = req.body.client;
    let arr =[];
    req.body.products.forEach(element => {
        //aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii no me trae lo que quiero 
            const productById = products.findOne({_id: element.productId});
            console.log(productById);
            if (productById) {
                arr.push(element);
            }
    }
    )
    console.log(arr)
    newOrder.products = arr;
    const orderStored = await newOrder.save();
    return resp.send(orderStored)
    // const allProducts = req.body.products.map((currentProduct) => ({
    //     product: arrProducts.find(p._id.equals(currentProduct._id)),
    //     qty: currentProduct.qty
    // }));

    
};

