const {postProduct} = require('../controller/products')
const mongoose = require('mongoose')
    //const Users = require('../models/modelUsers');
const { MongoMemoryServer } = require('mongodb-memory-server');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
let port;
beforeEach(async() => {
    // eslint-disable-next-line require-atomic-updates
    mongoServer = new MongoMemoryServer();
    port = await mongoServer.getPort();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, (err) => {
        if (err) console.error(err);
    });
});
afterEach(async (done) => {
    // Closing the DB connection allows Jest to exit successfully.
    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
    }
    await mongoose.connection.close()
    done();
  });

afterEach(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  if (mongoServer) {
      await mongoose.disconnect();
      await mongoServer.stop();
  }
  await mongoose.connection.close()
  done();
});

const requestPostProduct = {
  headers: {
      authorization: '',
  },
  body: {
      name: 'superCarnievichion',
      price: 1,
      type: 'hamburguesa'
  },
}
  const responseObjectPostProduct = {
    name: 'superCarnievichion',
    price: 1,
    type: 'hamburguesa'
};
const requestCreateProductError = {
  headers: {
      authorization: '',
  },
  body: {
      name: 'pizza mia',
      price: ''
  },
};

const requestCreateProductError2 = {
  headers: {
      authorization: '',
  },
  body: {
      name: '',
      price: '28'
  },
};

describe('POST/ product:uid', () => {
  const resp = {
    send: jest.fn(json => json)
  };

  const next = jest.fn(json => json);

 
  it('El administrador debería poder crear un nuevo producto', async() => {
     await postProduct(requestPostProduct,resp,next);
     expect(resp.send.mock.results[0].value).toMatchObject(responseObjectPostProduct)
  })
  it('El administrador debería poder crear un nuevo producto', async() => {
    await postProduct(requestPostProduct,resp,next);
    expect(resp.send.mock.results[0].value).toMatchObject(responseObjectPostProduct)
 })
 it('Debería retornar un error 400 si no se define `name` o `price`', async() => {
  await postProduct(requestCreateProductError, resp, next);
  await postProduct(requestCreateProductError2, resp, next);
  expect(next.mock.calls[0][0]).toBe(400);
  expect(next.mock.calls[0][0]).toBe(400);
})
  
});