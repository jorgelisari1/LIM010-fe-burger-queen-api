const users = require("../model/modelUsers");
const bcrypt = require("bcrypt");

module.exports.getUsers = async (req, resp) => {
  
  try {
    const result = await users.find().exec();
    resp.send(result);
  } catch (error) {
    resp.status(500).send(error);
}
};

module.exports.getUserId = async (req, resp) => {
  
 //console.log(req);
};

module.exports.postUser = async (req, resp, next) => {
  if (!req.body.email || !req.body.password) {
    return next(400);
  }
  console.log('aca estoy ');
  const userValid = await users.findOne({ email: req.body.email });
  console.log('aca sigo user',userValid)
  if (userValid) return next(403);

  let newUser = new users();
  console.log('aca sigo newuser', newUser)
  console.log('aca sigo req.body.email', req.body.email)
  newUser.email = req.body.email;
  console.log('aca sigo newuserrrrrrrrrrr', newUser)
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  console.log('continuamos 22222222', newUser)
  if (req.body._id) {
    newUser._id = req.body._id;
  }
  if (req.body.roles && req.body.roles.admin) {
    newUser.roles = { admin: true };
  }
  console.log('continuamos', newUser)

  
  const userStored=  newUser.save(function(err) {
    if (err) throw err;
 
    console.log('User successfully saved.');
});
  console.log('fin', userStored)
  resp.send({
    roles: userStored.roles,
    _id: userStored._id.toString(),
    email: userStored.email
  });
};

// module.exports.putUser = async (req, resp, next) => {
//   try {
//     if (!isAdmin(req) && req.body.roles) {
//       return next(403);
//     };

//     if (!req.body.email && !req.body.password && !isAdmin(req)) {
//       return next(400)
//     }
    
//     let obj = uidOrEmail(req.params.uid);

//     const userFounded = await users.findOne(obj);
//     if (req.body.email) {
//       userFounded.email = req.body.email;
//     }
//     if (req.body.password) {
//       userFounded.password = bcrypt.hashSync(req.body.password, 10);
//     }
//     const userSaved = await userFounded.save();
//     if (userSaved) {
//       return resp.send({ message: 'Cambios registrados satisfactoriamente' });
//     }
//   } catch (e) {
//     return next(404)
//   };
