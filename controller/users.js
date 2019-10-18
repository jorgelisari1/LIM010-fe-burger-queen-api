/* eslint-disable no-undef */
/* eslint-disable new-cap */
const users = require("../model/modelUsers");
const bcrypt = require("bcrypt");

uidOrEmail = (param) => {
  console.log('uidOrEmail', uidOrEmail);
  let obj = new Object();
  if (param.indexOf('@') < 0) {
    obj._id = param;
  } else {
    obj.email = param;
  }
  return obj
}

module.exports.getUsers = async (req, resp) => {
  try {
    const result = await users.find().exec();
    resp.send(result);
  } catch (error) {
    resp.status(500).send(error);
  }
};

module.exports.getUserId = async (req, resp) => {

  console.log(req);
};

module.exports.postUser = async (req, resp, next) => {
  if (!req.body.email || !req.body.password) {
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
    console.log('aquii 1', !isAdmin(req) && req.body.roles);
    if (!isAdmin(req) && req.body.roles) {
      return next(403);
    };

    console.log('aquii 2 if', !req.body.email && !req.body.password && !isAdmin(req));
    if (!req.body.email && !req.body.password && !isAdmin(req)) {
      return next(400)
    }
    let obj = uidOrEmail(req.params.uid);
    console.log('obj de uidOr Email', obj);
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

module.exports.deleteUser = async (req, resp, next) => {
  try {
    const obj = uidOrEmail(req.params.uid);
    const userdeleted = await users.findOne(obj)
    if (!userdeleted) {
      return next(404)
    }
    const userRemoved = await users.remove(obj);
    return resp.send({ message: 'Se borro satisfactoriamente!' });

  } catch (e) {
    return next(404)
  }
};
