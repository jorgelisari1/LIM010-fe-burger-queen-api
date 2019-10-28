const express = require('express');
const bodyParser = require('body-parser')
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
// const mongoClient = require('mongodb').MongoClient;
// const morgan = require('morgan'); app.use(morgan('dev'));
// Cargamos el módulo de mongoose para poder conectarnos a MongoDB
const  mongoose = require('mongoose');

// Llamamos a express para poder crear el servidor
const app = express();

const { port, dbUrl, secret } = config;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('config', config);

app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json());
app.use(authMiddleware(secret));
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// TODO: Conección a la BD en mogodb
mongoose.connect(dbUrl)
.then((db) => {
  console.log('db is connected');
  // Registrar rutas
  routes(app, (err) => {
    if (err) {
      throw err;
    }
  
    app.use(errorHandler);
  
    app.listen(port, () => {
      console.info(`App listening on port ${port}`);
    });
  });
}).catch(err => console.log(err));

