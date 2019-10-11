const users = require('../models/modelUsers');
const bcrypt = require('bcrypt');

module.exports.postUser = async(req, resp, next) => {
  if (!req.body.email || !req.body.password) {
      return next(400)
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
      newUser.roles = { admin: true }
  }
  const userStored = await newUser.save();
  return resp.send({
      roles: userStored.roles,
      _id: userStored._id.toString(),
      email: userStored.email
  });

};