const products = require('../model/modelProducts');
const pagination = require('../utils/pagination');

module.exports.postProduct = async(req, resp, next) => {
    try {
        if (!req.body.name || !req.body.price) {
            return next(400)
        }
        /*Primero, como administrador debo poder crear productos*/
        let newProduct = new products({
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            type: req.body.type
        });
        const saved = await newProduct.save()
        return resp.send(saved);
    } catch (e) {
        return next(404)
    }
}

module.exports.getProducts = async(req, resp, next) => {
    let pageLimit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
    products.find().count().then((number) => {
        resp.set('link', pagination(protocolo, page, pageLimit, number))
    });
    const result = await products.find().skip((page - 1) * pageLimit).limit(pageLimit).exec()
    return resp.send(result);
}

module.exports.getProductById = async(req, resp, next) => {    
    try {
        const productById = await products.findOne({ _id: req.params.productId })
        if (!productById) {
            return next(404)
        } 
        return resp.send(productById);
      } catch(e) {
            return next(404)
        }   
}