const {User, AccessToken, RefreshToken} = require('../models');
const bcrypt = require('bcryptjs');
const utils = require('../utils');

class UsersController {

    getOne(request, response) {
        return new User().findOne(request.params.id)
            .then(user => response.status(200).json(user))
            .catch(error => response.status(400).send(error));
    }

    getAll(request, response) {
        return new User().findAll()
            .then(users => response.status(200).json(users))
            .catch(error => response.status(400).send(error));
    }

    register(request, response) {

        bcrypt.genSalt(10, (error, salt) => {

            if (error) {
                return response.status(400).send(error);
            }

            bcrypt.hash(request.body.password, salt, (error, hash) => {

                if (error) {
                    return response.status(400).send(error);
                }

                let user = new User();

                let data = {
                    id: utils.generateUUID(),
                    clientID: request.body.clientID,
                    name: request.body.name,
                    email: request.body.email,
                    password: hash,
                };

                return user.save(data)
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

        return new User().findByCriteria({email: authUser.email, id: authUser.id})
            .then(user => {

                if (!user) {
                    return response.status(404).json(user);
                }

                new AccessToken().update({revoked: true}, {userID: authUser.id, revoked: false})
                    .then(token => {

                        //todo: add response to send
                        if (!token) {

                            let data = {
                                message: "Token not found"
                            };

                            return response.status(404).send(data);

                        }

                        new RefreshToken().update({revoked: true}, {userID: authUser.id, revoked: false})
                            .then(refreshToken => console.log(refreshToken))
                            .catch(error => console.log(error));

                    })
                    .catch(error => response.status(400).send(error));

            })
            .catch(error => response.status(400).send(error));

    }

}

module.exports = new UsersController();
