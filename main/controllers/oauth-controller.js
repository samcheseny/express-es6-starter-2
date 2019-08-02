const oauth2orize = require('oauth2orize');
const {AccessToken, RefreshToken, User} = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Utilities = require('../utils');
const passport = require('passport');

const server = oauth2orize.createServer();

// Resource Owner Password
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {

    User.findByCriteria({email: username})
        .then(user => {

            if (!user) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password)
                .then(response => {

                    if (!response) {
                        return done(null, false);
                    }

                    let token = Utilities.getUniqueID(256);
                    let refreshToken = Utilities.getUniqueID(256);
                    let tokenHash = crypto.createHash('sha1').update(token).digest('hex');
                    let refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');
                    let expirationDate = new Date(new Date().getTime() + (3600 * 1000));

                    let data = {
                        id: Utilities.generateUUID(),
                        token: tokenHash,
                        expirationDate: expirationDate,
                        clientID: client.id,
                        userID: user.id,
                        scope: scope
                    };

                    AccessToken.save(data)
                        .then(createdAccessToken => {

                            data = {
                                id: Utilities.generateUUID(),
                                refreshToken: refreshTokenHash,
                                clientID: client.id,
                                userID: user.id
                            };

                            RefreshToken.save(data)
                                .then(createdRefreshToken =>
                                    done(null, token, refreshToken, {expires_in: expirationDate})
                                )
                                .catch(error => done(error));

                        })
                        .catch(error => done(error));
                })
                .catch(error => done(error));
        })
        .catch(error => done(error));

}));

// Refresh Token
server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {

    let refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');

    RefreshToken.findByCriteria({refreshToken: refreshTokenHash, revoked: false})
        .then(token => {

            if (!token) {
                return done(null, false);
            }

            let newAccessToken = Utilities.getUniqueID(256);
            let accessTokenHash = crypto.createHash('sha1').update(newAccessToken).digest('hex');
            let expirationDate = new Date(new Date().getTime() + (3600 * 1000));

            AccessToken.update(
                {token: accessTokenHash, scope: scope, expirationDate: expirationDate},
                {userID: token.userID}
            )
                .then(token => done(null, newAccessToken, refreshToken, {expires_in: expirationDate}))
                .catch(error => done(error));

        })
        .catch(error => done(error));
}));

// Token endpoint
exports.token = [
    passport.authenticate('clientPassword', {session: false}),
    server.token(),
    server.errorHandler()
];