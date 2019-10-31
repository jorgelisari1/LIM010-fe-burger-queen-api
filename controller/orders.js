/* eslint-disable require-atomic-updates */
const products = require('../model/modelProducts');
const order = require('../model/modelOrders');
const mongodb = require('mongodb');

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
    console.log('holiiiiis');
    req.body.products.forEach(element => {
        //aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii no me trae lo que quiero 
        products.findById(element.productId, function (err, doc) {
            if (err){
                console.log('aquiiii',err);
            }
            console.log(doc);
            arr.push({
                product: {
                    _id: element.productId,
                    name: doc.name,
                    price: doc.price
                },
                qty: element.qty
            })
               
          });
            
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

/*module.exports.postOrders = async(req, resp, next) => {
    if (!req.body.products || req.body.products.length === 0) {
        return next(400);
    }

    let newOrder = new order();
    newOrder.dateEntry = Date.now();
    newOrder.userId = req.headers.user._id;
    newOrder.client = req.body.client;

    const arrOfProducts = await products.find({ _id: { $in: req.body.products.map(p => mongodb.ObjectId(p.product)) } })
    if (arrOfProducts.length !== req.body.products.length) {
        req.body.products = req.body.products.filter((x) => {
            return x !== null || undefined;
        })
    }
    const productsReales = req.body.products.map((p, index) => ({
        product: {
            _id: p.product,
            name: arrOfProducts[index].name,
            price: arrOfProducts[index].price
        },
        qty: p.qty
    }));

    newOrder.products = productsReales;
    const orderStored = await newOrder.save();
    return resp.send(orderStored)
};*/