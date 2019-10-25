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
