const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);


describe('/First Test Collection', () => {

    it('test default API welcome route...', (done) => {
        
        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal('Welcome to the MEN-RESTful-API');
            done();
        });
    });

    it('should verify that we have 0 tasks in the DB', (done) => {
        chai.request(server)
        .get('/api/tasks')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        });
    });

    it('should POST a valid task', (done) => {

        let task = {
            name: "Test Task",
            description: "Test Task Description",
            status: "public",
            createdAt: "2021-04-15T10:24:27.774+00:00",
            deadline: "2021-04-19T10:24:27.774+00:00"
        }
        chai.request(server)
        .post('/api/tasks')
        .send(task)
        .end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    it('should verify that we have 1 tasks in the DB', (done) => {
        chai.request(server)
        .get('/api/tasks')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            done();
        });
    });




    it('should test two values...', () => {
        //actual test content in here
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);
    })
}) 