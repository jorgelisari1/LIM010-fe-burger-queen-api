const { getUsers, getUserUid, postUser, putUser, deleteUser } = require('../controller/users');
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server');
    
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

  describe('getUsers', () => {
    it('should get users collection', (done) => {
      done();
    });
  });
  