'use strict'
const mongoClient = require('mongodb').MongoClient;
// Cargamos el módulo de mongoose
// var mongoose =  require('mongoose');
// Usaremos los esquemas
var Schema = mongoClient.Schema;
// Creamos el objeto del esquema y sus atributos
var UserSchema = Schema({
    email: String,
    password: String,
    roles: Object,
    admin: Boolean,
});
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoClient.model('User', UserSchema);