const router = require('express').Router();
const {OauthController, UsersController} = require('../controllers');
const passport = require('passport');

router.post('/oauth/token', OauthController.token);

router.post('/register', UsersController.register);

router.post('/logout', passport.authenticate('bearer', {session: false}), UsersController.logout);

module.exports = router;