const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const {AccessToken, Client, User} = require('../models');
const crypto = require('crypto');

passport.use("clientPassword", new ClientPasswordStrategy(
    (client_id, client_secret, done) => {

        new Client().findOne(client_id)
            .then(client => {

                if (!client || !client.active) {
                    return done(null, false);
                }

                if (client.secret === client_secret) {
                    return done(null, client);
                }

                return done(null, false);

            })
            .catch(error => done(error))
    }
));

passport.use("bearer", new BearerStrategy(
    (token, done) => {

        let tokenHash = crypto.createHash('sha1').update(token).digest('hex');

        new AccessToken().findByCriteria({token: tokenHash, revoked: false})
            .then(accessToken => {

                if (!accessToken || new Date() > accessToken.expirationDate) {
                    return done(null, false);
                }

                new User().findOne(accessToken.userID)
                    .then(user => {

                        if (!user) {
                            return done(null, false);
                        }

                        return done(null, user);
                    })
                    .catch(error => done(error))

            })
            .catch(error => done(error));

    })
);

