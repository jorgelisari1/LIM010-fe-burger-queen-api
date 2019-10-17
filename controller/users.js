const bcrypt = require('bcrypt');
const users = require('../model/modelUsers');
const { isAdmin } = require('../middleware/auth');

module.exports.postUser = async (req, resp, next) => {
  if (!req.body.email || !req.body.password) {
    return next(400);
  }
  const userInvalid = await users.findOne({ email: req.body.email });
  if (userInvalid) return next(403);
  const newUser = new users();
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
    email: userStored.email,
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
    let obj = uidOrEmail(req.params.uid);

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
    return next(404);
  }
};
