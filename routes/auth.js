const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
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
      if (await bcrypt.compare(password, user.password)) {
        resp.send({ token: jwt.sign({ id: req.body._id }, secret) });
        next();
      } else {
        next(401);
      }

       resp.status(200).send({ token: token });
      
  })
});

  return nextMain();
};
