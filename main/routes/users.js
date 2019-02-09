const router = require('express').Router();
const passport = require('passport');
const {UsersController} = require('../controllers');

router.get('/sample', (request,response)=>{
    return response.json("sam");
});

router.get('/', passport.authenticate('bearer', {session: false}), UsersController.getAll);

module.exports = router;
