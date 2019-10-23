const { getUsers, getUserId, postUser, putUser, deleteUser } = require('../controller/users');
const mongoose = require('mongoose')
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

let requestPostUsers = {
    headers: {
        authorization: '',
    },
    body: {
        _id: '5d4916541d4f9a3b2dcac66d',
        email: 'jesseliz@prueba.pe',
        password: '123456'
    },
};

const responseObjectOfUser = {
    roles: { admin: false },
    _id: '5d4916541d4f9a3b2dcac66d',
    email: 'jesseliz@prueba.pe',
};
const emptyRequest = {
    headers: {
        authorization: '',
    },
    body: {
        email: '',
        password: '1234567'
    },
};
const allEmptyRequest = {
    headers: {
        authorization: '',
    },
    body: {
        email: '',
        password: ''
    },
};
const responseObjectOfNewAdmin = {
    roles: { admin: true },
    _id: '5d4916541d4f9a3b2dcac66d', 
    email: 'jesseliz@prueba.pe',
};

const requestOfPostUsersDuplicated = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'jesseliz@prueba.pe',
        password: 'contraseña'
    },
}
// POST Method Test
describe('POST/ users:uid', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debería crear un nuevo usuario', async() => {
        await postUser(requestPostUsers, resp, next);
        expect(resp.send.mock.results[0].value).toEqual(responseObjectOfUser);
       
    });
    it('El administrador debería poder crear a otro administrador', async(done) => {
        requestPostUsers.body.roles = { admin: true }
        const newAdmin = await postUser(requestPostUsers, resp, next);
        resp.send.mockReturnValue(newAdmin)
        expect(resp.send()).toEqual(responseObjectOfNewAdmin);
        done();
    })
    it('Debería retornar un error 400 si no existe email o password', async(done) => {
        await postUser(emptyRequest, resp, next);
        await postUser(allEmptyRequest, resp, next);
        expect(next.mock.calls[0][0]).toBe(400);
        expect(next.mock.calls[1][0]).toBe(400);
        done();
    })
    it('Debería retornar un error 403 si ya existe un usuario registrado con el mismo email', async(done) => {
        await postUser(requestOfPostUsersDuplicated, resp, next);
        await postUser(requestOfPostUsersDuplicated, resp, next);
        expect(next.mock.calls[2][0]).toBe(403);
        done();
    })
});

const requestOfGetUsersByEmail = {
    'headers': {
        authorization: ''
    },
    params: {
        uid: 'jess@prueba.post'
    }
};
const requestOfPostUsers3 = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'jess@prueba.post',
        password: 'inga123'
    },
};
const responseObjectOfUser3 = {
    roles: { admin: false },
    email: 'jess@prueba.post',
};

const requestOfGetUsersById = {
    'headers': {
        authorization: ''
    },
    params: {

    }
};
describe('GET/ users:uid', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);


    it('Debería retornar el usuario llamado por ID', async() => {
        const user0 = await postUser(requestOfPostUsers3, resp, next);
        requestOfGetUsersById.params.uid = user0._id.toString();
        responseObjectOfUser3._id = user0._id;
        const getUsersTest = await getUserId(requestOfGetUsersById, resp, next);
        resp.send.mockReturnValue(getUsersTest)
        expect(resp.send()).toEqual(responseObjectOfUser3);
    });

    it('Debería retornar el usuario llamado por Email', async() => {
        const user = await postUser(requestOfPostUsers3, resp, next);
        responseObjectOfUser3._id = user._id;
        const functTest = await getUserId(requestOfGetUsersByEmail, resp, next);
        resp.send.mockReturnValue(functTest)
        expect(resp.send()).toEqual(responseObjectOfUser3);
    });
    it('Debería retornar un error 404 si se ingresa un parametro uid invalido', async() => {
        const user = await postUser(requestOfPostUsers3, resp, next);
        requestOfGetUsersById.params.uid = '5d4916541d4f9a3b2dcac66d';
        await getUserId(requestOfGetUsersById, resp, next);
        expect(next.mock.calls[0][0]).toBe(404);
    });
});
