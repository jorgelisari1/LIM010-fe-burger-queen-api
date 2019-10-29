const { getOrders, getOrdersById, postOrders} = require('../controller/orders')
const { postProduct } = require('../controller/products')
const mongoose = require('mongoose')
    //const Users = require('../models/modelUsers');
const { MongoMemoryServer } = require('mongodb-memory-server');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
let port;

beforeEach(async() => {
    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
    }
    const mongoServer = new MongoMemoryServer();
    port = await mongoServer.getPort();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, (err) => {
        if (err) console.error(err);
    });
});


const reqPostProduct = {
    headers: '',
    body: {
        name: 'productToOrder',
        price: '10',
        type: 'breakfast',
    }
};
const reqPostOrders = {
    headers: {
        authorization: '',
        user: {
            _id: '5d4916541d4f9a3b2dcac66d',
            email: 'admin@localhost',
            password: 'changeme',
            roles: { admin: true }
        }
    },
    body: {
        userId: '5d4916541d4f9a3b2dcac66d',
        client: 'Maria',
        products: [{ qty: 5 }]
    }
}
const reqPostOrders2 = {
    headers: {
        authorization: '',

    },
    body: {
        userId: '5d4916541d4f9a3b2dcac66d',
        products: []
    }
}


describe('POST/ orders', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debería crear una nueva orden', async() => {
        const createdProduct = await postProduct(reqPostProduct, resp, next);
        reqPostOrders.body.products[0].product = createdProduct._id;
        await postOrders(reqPostOrders, resp, next);
        expect(resp.send.mock.results[1].value).toHaveProperty('_id');
        expect(resp.send.mock.results[1].value).toHaveProperty('status', 'pending');
        expect(resp.send.mock.results[1].value).toHaveProperty('userId', '5d4916541d4f9a3b2dcac66d');
    });
    it('Debería retornar 400 si no se ingresan datos', async() => {
        await postOrders(reqPostOrders2, resp, next);
        expect(next.mock.calls[0][0]).toBe(400);
    });
});
