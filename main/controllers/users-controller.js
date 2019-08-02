const {User, AccessToken, RefreshToken} = require('../models');
const bcrypt = require('bcryptjs');
const Utilities = require('../utils');
const {performance} = require('perf_hooks');
const {debuglog} = require('util');
const debug = debuglog('performance');

class UsersController {

    getOne(request, response) {
        return User.findOne(request.params.id)
            .then(user => response.status(200).json(user))
            .catch(error => response.status(400).send(error));
    }

    getAll(request, response) {
        return User.findAll()
            .then(users => response.status(200).json(users))
            .catch(error => response.status(400).send(error));
    }

    register(request, response) {

        performance.mark('Begin registration');

        bcrypt.genSalt(10, (error, salt) => {

            performance.mark('Finish salt generation');

            if (error) {
                return response.status(400).send(error);
            }

            performance.mark('Start hashing');

            bcrypt.hash(request.body.password, salt, (error, hash) => {

                performance.mark('Finish hashing');

                if (error) {
                    return response.status(400).send(error);
                }

                let data = {
                    id: Utilities.generateUUID(),
                    clientID: request.body.clientID,
                    name: request.body.name,
                    email: request.body.email,
                    password: hash,
                };

                performance.mark('Finish registration');

                performance.measure('Registration', 'Begin registration', 'Finish registration');
                performance.measure('Salt generation', 'Begin registration', 'Finish salt generation');
                performance.measure('Hashing', 'Start hashing', 'Finish hashing');

                performance.getEntriesByType('measure')
                    .forEach((measurement) => debug('\x1b[33m%s\x1b[0m', `${measurement.name} : ${measurement.duration}`));

                return User.save(data)
                    .then(user => response.status(201).json(user))
                    .catch(error => response.status(400).send(error));

            });

        });
    }

    logout(request, response) {

        //todo: validation
        //todo: use correct http status codes
        //todo: return model info to client alongside token on login
        let authUser = request.body.model;

        return UsersController.logoutAUser(authUser.email, authUser.id)
            .then(result=> response.status(result.status).send(result.data))
            .catch(error=> response.status(400).send(error));

    }

    async static logoutAUser(email, id){

        try{

            let result ={
                status:205,
                data:null
            };
    
            //Get the user
            let user = await User.findByCriteria({email, id})
    
            if (!user) {
                return {
                    status:404,
                    data:{
                        message:`User with ID: ${id} was not found`
                    }
                };
            }
    
            //Update the access token
            let accessToken =  await AccessToken.update(
                {revoked: true},
                {userID: id, revoked: false}
            )
    
            if (!accessToken) {
                return {
                    status:404,
                    data:{
                        message:`Access token for user with ID: ${id} was not found`
                    }
                };
            }
    
            //Update the refresh token
            let refreshToken = RefreshToken.update(
                {revoked: true},
                {userID: id, revoked: false}
            );
                 
            console.log(refreshToken);

            return result;

        } catch(error){
            throw new Error(error)
        }

    }

}

module.exports = new UsersController();
