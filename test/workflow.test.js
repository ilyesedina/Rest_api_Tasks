const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);


describe('User workflow tests', () => {

    it('should register + login a user, create task and verify 1 in DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                
                // Asserts
                expect(res.status).to.be.equal(200);   
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);
               
                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@petersen.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);   
                        expect(res.body.error).to.be.equal(null);                        
                        let token = res.body.data.token;

                        // 3) Create new task
                        let task =
                        {
                            name: "Test Task",
                            description: "Test Task Description",
                            status: "public",
                            createdAt: "2021-04-15T10:24:27.774Z",
                            deadline: "2021-04-19T10:24:27.774Z"
                        };

                        chai.request(server)
                            .post('/api/tasks')
                            .set({ "auth-token": token })
                            .send(task)
                            .end((err, res) => {
                                
                                // Asserts
                                expect(res.status).to.be.equal(201);                                
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);
                                
                                let savedTask = res.body[0];
                                expect(savedTask.name).to.be.equal(task.name);
                                expect(savedTask.description).to.be.equal(task.description);
                                expect(savedTask.status).to.be.equal(task.status);
                                expect(savedTask.createdAt).to.be.equal(task.createdAt);
                                expect(savedTask.deadline).to.be.equal(task.deadline);


                                // 4) Verify one task in test DB
                                chai.request(server)
                                    .get('/api/tasks')
                                    .end((err, res) => {
                                        
                                        // Asserts
                                        expect(res.status).to.be.equal(200);                                
                                        expect(res.body).to.be.a('array');                                
                                        expect(res.body.length).to.be.eql(1);
                                
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should register + login a user, create task and delete it from DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                
                // Asserts
                expect(res.status).to.be.equal(200);   
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);
                
                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@petersen.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);                         
                        expect(res.body.error).to.be.equal(null);                        
                        let token = res.body.data.token;

                        // 3) Create new task
                        let task =
                        {
                            name: "Test Task",
                            description: "Test Task Description",
                            status: "public",
                            createdAt: "2021-04-15T10:24:27.774Z",
                            deadline: "2021-04-19T10:24:27.774Z"
                        };

                        chai.request(server)
                            .post('/api/tasks')
                            .set({ "auth-token": token })
                            .send(task)
                            .end((err, res) => {
                                
                                // Asserts
                                expect(res.status).to.be.equal(201);                                
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);
                                
                                let savedTask = res.body[0];
                                expect(savedTask.name).to.be.equal(task.name);
                                expect(savedTask.description).to.be.equal(task.description);
                                expect(savedTask.status).to.be.equal(task.status);
                                expect(savedTask.createdAt).to.be.equal(task.createdAt);
                                expect(savedTask.deadline).to.be.equal(task.deadline);


                                // 4) Delete task
                                chai.request(server)
                                    .delete('/api/tasks/' + savedTask._id)
                                    .set({ "auth-token": token })
                                    .end((err, res) => {
                                        
                                        // Asserts
                                        expect(res.status).to.be.equal(200);                                        
                                        const actualVal = res.body.message;
                                        expect(actualVal).to.be.equal('Task was deleted successfully!');        
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should register user with invalid input', (done) => {

        // 1) Register new user with invalid inputs
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "123" //Faulty password - Joi/validation should catch this...
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                                
                // Asserts
                expect(res.status).to.be.equal(400); //normal expect with no custom output message
                //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail
                
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal("\"password\" length must be at least 6 characters long");  
                done();              
            });
    });
});