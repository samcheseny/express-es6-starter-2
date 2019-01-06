describe('Testing Auth Routes', () => {

    beforeEach('Do something before each test', () => {

    });

    it('should get access token', (done) => {

        chai.request(server)
            .post('/api/oauth/token')
            .set('content-type', 'application/json')
            .send({
                client_id: "",
                client_secret: "client-secret",
                username: "john.doe@gmail.com",
                password: "my-password",
                grant_type: "password",
                scope: ""
            })
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.json;
                done();
            });

    });

    it('should add a new model', (done) => {

        chai.request(server)
            .post('/api/register')
            .set('content-type', 'application/json')
            .send({
                name: "John Doe",
                email: "john.doe@gmail.com",
                clientID: "uuid",
                password: "my-password",
            })
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.json;
                done();
            });

    });

    it('should logout an auth model', (done) => {

        chai.request(server)
            .post('/api/users')
            .set('content-type', 'application/json')
            .send({
                model: {
                    id: "uuid",
                    name: "John Doe",
                    email: "john.doe@gmail.com",
                    clientID: "uuid",
                }
            })
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.json;
                done();
            });

    });

    afterEach('Do something after each test', () => {

    });

});
