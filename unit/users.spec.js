const { getUsers, getUserUid, postUser, putUser, deleteUser } = require('../controllers/users');
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
    mongoServer = new MongoMemoryServer();
    port = await mongoServer.getPort();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, (err) => {
        if (err) console.error(err);
    });
});

let requestOfPostUsers = {
    headers: {
        authorization: '',
    },
    body: {
        _id: '5d4916541d4f9a3b2dcac66d',
        email: 'jess@gmail.com',
        password: '123456'
    },
};

const responseObjectOfUser = {
    roles: { admin: false },
    _id: '5d4916541d4f9a3b2dcac66d', //5d4916541d4f9a3b2dcac66d,
    email: 'jess@gmail.com',
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
const emptyRequest2 = {
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
    _id: '5d4916541d4f9a3b2dcac66d', //5d4916541d4f9a3b2dcac66d,
    email: 'jess@gmail.com',
};

const requestOfPostUsersDuplicated = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'jess@gmail.com',
        password: 'contraseña'
    },
}
describe('POST/ users:uid', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debería crear un nuevo usuario', async() => {
        await postUser(requestOfPostUsers, resp, next);
        expect(resp.send.mock.results[0].value).toEqual(responseObjectOfUser);
        //expect(userSend).toBe(responseObjectOfUser);
    });
    it('El administrador debería poder crear a otro administrador', async() => {
        requestOfPostUsers.body.roles = { admin: true }
        const newAdmin = await postUser(requestOfPostUsers, resp, next);
        resp.send.mockReturnValue(newAdmin)
        expect(resp.send()).toEqual(responseObjectOfNewAdmin);
    })
    it('Debería retornar un error 400 si no existe email o password', async() => {
        await postUser(emptyRequest, resp, next);
        await postUser(emptyRequest2, resp, next);
        expect(next.mock.calls[0][0]).toBe(400);
        expect(next.mock.calls[1][0]).toBe(400);
    })
    it('Debería retornar un error 403 si ya existe un usuario con ese email', async() => {
        await postUser(requestOfPostUsersDuplicated, resp, next);
        await postUser(requestOfPostUsersDuplicated, resp, next);
        expect(next.mock.calls[2][0]).toBe(403);

    })
});
/* const mockPostUSer = mock.fn(res= postUser(requestOfPostUsers, resp, next))
 */

const requestOfGetUsers = {
    'headers': {
        authorization: ''
    },
    'query': {
        limit: 10,
        page: 1,
    },
    'protocol': 'http',
    'get': jest.fn(res => `localhost:${port}`),
    'path': '/users',
};
const requestOfPostUsers2 = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'ariana@gmail.com',
        password: 'samaniego'
    },
};
//cuenta llamadaaas
let responseOfGetUsers = [];
describe('GET/ users', () => {
    const res = {
        send: jest.fn(json => json),
        set: jest.fn(json => json)
    };

    const next = jest.fn(json => json);


    it('Debería retornar el numero de usuarios creados', async() => {
        const userSend2 = await postUser(requestOfPostUsers2, res, next);
        const userSend = await postUser(requestOfPostUsers, res, next);
        responseOfGetUsers.push(userSend2, userSend);
        const users = await getUsers(requestOfGetUsers, res, next);
        expect(users).toHaveLength(responseOfGetUsers.length);
        expect(res.send.mock.calls[2].length).toBe(1)
    });
});


const requestOfGetUsersByEmail = {
    'headers': {
        authorization: ''
    },
    params: {
        uid: 'ariana@gmail.com'
    }
};
const requestOfPostUsers3 = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'ariana@gmail.com',
        password: 'pass123'
    },
};
const responseObjectOfUser3 = {
    roles: { admin: false },
    email: 'ariana@gmail.com',
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
        const getUsersTest = await getUserUid(requestOfGetUsersById, resp, next);
        resp.send.mockReturnValue(getUsersTest)
        expect(resp.send()).toEqual(responseObjectOfUser3);
    });

    it('Debería retornar el usuario llamado por Email', async() => {
        const user = await postUser(requestOfPostUsers3, resp, next);
        responseObjectOfUser3._id = user._id;
        const functTest = await getUserUid(requestOfGetUsersByEmail, resp, next);
        resp.send.mockReturnValue(functTest)
        expect(resp.send()).toEqual(responseObjectOfUser3);
    });
    it('Debería retornar un error 404 si se ingresa un parametro uid invalido', async() => {
        const user = await postUser(requestOfPostUsers3, resp, next);
        requestOfGetUsersById.params.uid = '5d4916541d4f9a3b2dcac66d';
        await getUserUid(requestOfGetUsersById, resp, next);
        expect(next.mock.calls[0][0]).toBe(404);
    });
});



const requestOfPostUsersFromPut = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'jess2@gmail.com',
        password: '123456'
    },
};
const emptyOfPostUsersFromPut = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: false },
            email: 'jess2@gmail.com',
        }
    },
    body: {
        email: ''
    },
    params: {
        uid: 'jess2@gmail.com'
    }
};
const requestOfPutUsersByEmail = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: false },
            email: 'jess2@gmail.com',
        }
    },
    body: {
        email: 'jesseliz3@gmail.com',
    },
    params: {
        uid: 'jess2@gmail.com'
    }
};
const requestOfPutModifyRoles = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: false },
            email: 'jess2@gmail.com',
        }
    },
    body: {
        roles: {
            admin: true,
        }
    },
    params: {
        uid: 'jess2@gmail.com'
    }
};
describe('PUT/ users:uid', () => {
    const response = {
        send: jest.fn(json => json),
    };

    const next2 = jest.fn(json => json);


    it('Debería editar usuario llamado por ID', async() => {
        const userFromTestPut = await postUser(requestOfPostUsersFromPut, response, next2);
        const requestOfPutUsersById = {
            'headers': {
                authorization: '',
                user: {
                    roles: { admin: false },
                    _id: userFromTestPut._id.toString(), //5d4916541d4f9a3b2dcac66d,
                    email: 'jess2@gmail.com',
                }
            },
            body: {
                email: 'jesse@gmail.com',
                password: 'abcdefg'
            },
            params: {
                uid: userFromTestPut._id.toString()
            }
        };
        const userChange = await putUser(requestOfPutUsersById, response, next2);
        response.send.mockReturnValue(userChange)
        expect(response.send()).toEqual({ message: 'Cambios registrados satisfactoriamente' });
    });

    it('Debería retornar el usuario llamado por Email', async() => {
        await postUser(requestOfPostUsersFromPut, response, next2);
        const userChange2 = await putUser(requestOfPutUsersByEmail, response, next2);
        response.send.mockReturnValue(userChange2);
        expect(response.send()).toEqual({ message: 'Cambios registrados satisfactoriamente' });
    });

    it('Debería retornar un error 404 si se ingresa un parametro uid inválido', async() => {
        await postUser(requestOfPostUsersFromPut, response, next2);
        requestOfPutUsersByEmail.params.uid = '5d49896541d4f9a3bl2dcuc66d';
        await putUser(requestOfPutUsersByEmail, response, next2);
        expect(next2.mock.calls[0][0]).toBe(404);
    });
    it('Debería retornar un error 403 si un usuario quiere modificar sus roles y no es administrador', async() => {
        await postUser(requestOfPostUsersFromPut, response, next2);
        await putUser(requestOfPutModifyRoles, response, next2);
        expect(next2.mock.calls[1][0]).toBe(403);
    });
    it('Debería retornar un error 400 si ingresa un email o password vacío', async() => {
        await postUser(requestOfPostUsersFromPut, response, next2);
        await putUser(emptyOfPostUsersFromPut, response, next2);
        expect(next2.mock.calls[2][0]).toBe(400);
    });


});

const requestDeleteUsersByEmail = {

    'headers': {
        authorization: '',
        user: {
            roles: { admin: false },
            _id: 'xxxxxxxxxxxxxxxxxxxx', //5d4916541d4f9a3b2dcac66d,
            email: 'delete@gmail.com',
        }
    },
    params: {
        uid: 'delete@gmail.com'
    }
};
const requestAdminToDelete = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: true },
            _id: 'xxxxxxxxxxxxxxxxxxxx', //5d4916541d4f9a3b2dcac66d,
            email: 'delete@gmail.com',
        }
    },
    params: {
        uid: 'delete@gmail.com'
    }
};
let requestOfPostUsersFromDelete = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'delete@gmail.com',
        password: '123456',
    },
};
const requestAdminToDeleteAuto = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: true },
            _id: '12345678910111213141',
            email: 'admin@gmail',
        }
    },
    params: {
        uid: 'admin@gmail',
    }
};

describe('DELETE/ users:uid', () => {
    const respon = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debería elimiar un usuario creado por uid', async() => {
        const userSaved = await postUser(requestOfPostUsersFromDelete, respon, next);
        const requestDeleteUsersById = {
            'headers': {
                authorization: '',
                user: {
                    roles: { admin: false },
                    _id: 'xxxxxxxxxxxxxxxxxx',
                    email: 'admin@labo.la',
                }
            },
            params: {
                uid: userSaved._id.toString(),
            }
        };
        const userDeleted = await deleteUser(requestDeleteUsersById, respon, next);
        respon.send.mockReturnValue(userDeleted);
        expect(respon.send()).toEqual({ message: 'Se borro satisfactoriamente!' });
    });
    it('Debería elimiar un usuario creado por email', async() => {
        await postUser(requestOfPostUsersFromDelete, respon, next);
        const userDeleted2 = await deleteUser(requestAdminToDelete, respon, next);
        respon.send.mockReturnValue(userDeleted2);
        expect(respon.send()).toEqual({ message: 'Se borro satisfactoriamente!' });
    });

    it('Debería retornar un error 404 si se ingresa un id invalid', async() => {
        await postUser(requestOfPostUsersFromDelete, respon, next);
        requestDeleteUsersByEmail.params.uid = '5d3b0d0a99320e3f0ce80b96';
        await deleteUser(requestDeleteUsersByEmail, respon, next);
        expect(next.mock.calls[0][0]).toBe(404);
    });

    it('Debería retornar un error 404 si se ingresa un mal dato', async() => {
        await postUser(requestOfPostUsersFromDelete, respon, next);
        requestDeleteUsersByEmail.params.uid = 'xxxxxxxxxxxxxx';
        await deleteUser(requestDeleteUsersByEmail, respon, next);
        expect(next.mock.calls[1][0]).toBe(404);
    });

});