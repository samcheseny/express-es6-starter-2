describe('Testing Users Routes', () => {

    beforeEach('Do something before each test', () => {

    });

    it('should list all active users', (done) => {

        chai.request(server)
            .get('/api/users')
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.json;
                done();
            });

    });

    afterEach('Do something after each test', () => {

    });
});
