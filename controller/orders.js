const order = require('../model/modelOrders')
const products = require('../model/modelProducts');
const pagination = require('../utils/pagination');
const mongodb = require('mongodb');

module.exports.getOrders = async(req, resp, next) => {
    let limitPage = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
    const number = await order.find().countDocuments();
    resp.set('link', pagination(protocolo, page, limitPage, number))
    const orderFound = await order.find().skip((page - 1) * limitPage).limit(limitPage).exec();
    if (!orderFound) return next(400)
    return resp.send(orderFound);
   
};

module.exports.getOrdersById = async(req, resp, next) => {
    try {
        const orderFound = await order.findOne({ _id: req.params.orderid });
        if (!orderFound) return next(404);
        return resp.send(orderFound);
    } catch (e) {
        return next(404)
    }
};

