const jwt = require('jsonwebtoken');
const users = require('../model/modelUsers');

/*var mongoose = require('mongoose');
var _id = mongoose.mongo.ObjectId("4eb6e7e7e9b7f4194e000001");*/
//var moment = require('moment');
module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
   
    return next();
  }
//coloqué las  dos comas porque authorization.split(' ') es un array con 3 elementos y el tercero es el token
  const [type,token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    
    if (err) {
     
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    console.log('id', decodedToken.uid)
    users.findOne({ _id: decodedToken.uid }, (err, user) => {
      if (err) { return next(500, err) }
      
      req.headers.user = user;
      console.log('headers',req.headers.user);
      next();
  })
    
  });
};

module.exports.isAuthenticated = (req) => (
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
(req.headers.user) ? true : false
);


module.exports.isAdmin = (req) => { //false
// TODO: decidir por la informacion del request si la usuaria es admin
return req.headers.user && req.headers.user.roles.admin
};

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
