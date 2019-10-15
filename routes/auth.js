const user = require('../model/modelUsers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
<<<<<<< HEAD
const bcrypt = require('bcrypt');
=======
>>>>>>> a48fafccf601733b8deb324dd37a1b7bacc01e48
const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */

  comparePassword = async(password, userStored) => {
    const res = await bcrypt.compare(password, userStored.password);
    if (res) {
        // console.error(password,userStored.password,'holaa')
        const token = jwt.sign({ uid: userStored._id }, secret);
        return token;
    }
    return res;
  };

  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    
    // TODO: autenticar a la usuarix
    
    user.findOne({ email: req.body.email }, async(err, userStored) => {
      if (err) {
          return resp.send(err);
      };
      if (!userStored) {
          return next(404);
      };
<<<<<<< HEAD
      if (await bcrypt.compare(password, user.password)) {
        resp.send({ token: jwt.sign({ id: req.body._id }, secret) });
        next();
      } else {
        next(401);
      }

       resp.status(200).send({ token: token });
      
=======
      comparePassword(req.body.password, userStored).then((token) => {
          if (!token) {
              return next(401)
          }
          resp.status(200).send({ token: token });
      })
>>>>>>> a48fafccf601733b8deb324dd37a1b7bacc01e48
  })
});
  return nextMain();
};

