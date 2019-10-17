/* eslint-disable no-unused-vars */
'use strict'
// eslint-disable-next-line linebreak-style
const mongoClient = require('mongodb').MongoClient;
// Cargamos el módulo de mongoose
var mongoose = require('mongoose');
// Usaremos los esquemas
const Schema = mongoose.Schema;
// Creamos el objeto del esquema y sus atributos
const UserSchema = Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: Object,
    required: true,
    default: { admin: false }
  }

});
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('User', UserSchema);
