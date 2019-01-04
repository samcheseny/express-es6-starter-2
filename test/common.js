global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.assert = chai.assert;
global.expect = chai.expect;
global.server = require('../app');

chai.should();
chai.config.includeStack = true;
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

// Include common modules from your application that will be used among multiple test suites.
// global.myModule = require('../app/myModule');