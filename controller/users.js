const users = require("../model/modelUsers");
const pagination = require('../utils/pagination');
const bcrypt = require("bcrypt");
const { isAdmin } = require('../middleware/auth');

const uidOrEmail = (param) => {
  let obj = new Object();
  if (param.indexOf('@') < 0) {
      obj._id = param;
  } else {
      obj.email = param;
  }
  return obj
}
module.exports.getUsers = async(req, resp, next) => {
  let limitPage = parseInt(req.query.limit) || 10;
  let page = parseInt(req.query.page) || 1;
  let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
  users.find().count().then((number) => {
      resp.set('link', pagination(protocolo, page, limitPage, number))
  });
  const result = await users.find().skip((page - 1) * limitPage).limit(limitPage).exec()
  return resp.send(result);
}

module.exports.getUserId = async (req, resp,next) => {
  const obj = uidOrEmail(req.params.uid);
  const userFounded = await users.findOne(obj);
  if (!userFounded) {
      return next(404);
  }
   resp.send({
      roles: userFounded.roles,
      _id: userFounded._id.toString(),
      email: userFounded.email
  })
  return next();
};

module.exports.postUser = async (req, resp, next) => {
  if (!req.body.email || !req.body.password || !req.body.email.match(/[\d\w]+@[\d\w]+/i) || req.body.password.length < 3) {
    return next(400);
  }
  const userInvalid = await users.findOne({ email: req.body.email });
  
  if (userInvalid) return next(403);
  let newUser = new users();

  newUser.email = req.body.email;
  
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  
  if (req.body._id) {
    newUser._id = req.body._id;
  }
  if (req.body.roles && req.body.roles.admin) {
    newUser.roles = { admin: true };
  }
  const userStored = await newUser.save();
 
  return resp.send({
    roles: userStored.roles,
    _id: userStored._id.toString(),
    email: userStored.email
});
};

module.exports.putUser = async (req, resp, next) => {
  try {
    if (!isAdmin(req) && req.body.roles) {
      return next(403);
    }
    if (!req.body.email && !req.body.password && !isAdmin(req)) {
      return next(400)
    }
    
    obj = uidOrEmail(req.params.uid);

    const userFounded = await users.findOne(obj);
    if (req.body.email) {
      userFounded.email = req.body.email;
    }
    if (req.body.password) {
      userFounded.password = bcrypt.hashSync(req.body.password, 10);
    }
    const userSaved = await userFounded.save();
    if (userSaved) {
      return resp.send({ message: 'Cambios registrados satisfactoriamente' });
    }
  } catch (e) {
    return next(404)
  }
};

//Delete user
module.exports.deleteUser = async (req, resp, next) => {
  try {
    const obj = uidOrEmail(req.params.uid);
    const userdeleted = await users.findOne(obj)
    if (!userdeleted) {
      return next(404)
    }
    const userRemoved = await users.remove(obj);
    if (userRemoved) {
      return resp.send({ message: 'Se eliminó usuario satisfactoriamente' });
    }
} catch (e) {
  return next(404)
}};