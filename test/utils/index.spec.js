const utils = require('../../main/utils');

describe('Testing Utils', () => {

    beforeEach('Do something before each test', () => {

    });

    describe('getUniqueID', () => {

        it('should get a unique ID', () => {

            let idOne = utils.getUniqueID(256);
            let idTwo = utils.getUniqueID(256);

            expect(idOne).to.not.equal(idTwo);

        });

    });

    describe('generateUUID', () => {

        it('should generate a UUID', () => {

            let uuidOne = utils.generateUUID();
            let uuidTwo = utils.generateUUID();

            expect(uuidOne).to.not.equal(uuidTwo);

        });

    });

    afterEach('Do something after each test', () => {

    });

});