process.env.NODE_ENV = 'test';

const Task = require('../models/task');
const User = require('../models/user');

//clean up the database before and after each test
beforeEach((done) => { 
    Task.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    User.deleteMany({}, function(err) {});
    Task.deleteMany({}, function(err) {});
    done();
});