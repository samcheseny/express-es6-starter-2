const oauth2orize = require('oauth2orize');
const {AccessToken, RefreshToken, User} = require('../models/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const utils = require('../utils/index');
const passport = require('passport');

const server = oauth2orize.createServer();

// Resource Owner Password
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {

    User.findOne({where: {email: username}})
        .then(user => {

            console.log(client);

            if (!user) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password)
                .then(response => {

                    if (!response) {
                        return done(null, false);
                    }

                    let token = utils.getUniqueID(256);
                    let refreshToken = utils.getUniqueID(256);
                    let tokenHash = crypto.createHash('sha1').update(token).digest('hex');
                    let refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');
                    let expirationDate = new Date(new Date().getTime() + (3600 * 1000));

                    let newAccessToken = new AccessToken({
                        id: utils.generateUUID(),
                        token: tokenHash,
                        expirationDate: expirationDate,
                        clientID: client.id,
                        userID: user.id,
                        scope: scope
                    });

                    newAccessToken.save()
                        .then(createdAccessToken => {

                            let newRefreshToken = new RefreshToken({
                                id: utils.generateUUID(),
                                refreshToken: refreshTokenHash,
                                clientID: client.id,
                                userID: user.id
                            });

                            newRefreshToken.save()
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

    RefreshToken.findOne({where: {refreshToken: refreshTokenHash, revoked: false}})
        .then(token => {

            if (!token) {
                return done(null, false);
            }

            let newAccessToken = utils.getUniqueID(256);
            let accessTokenHash = crypto.createHash('sha1').update(newAccessToken).digest('hex');
            let expirationDate = new Date(new Date().getTime() + (3600 * 1000));

            AccessToken.update(
                {token: accessTokenHash, scope: scope, expirationDate: expirationDate},
                {returning: true, plain: true, where: {userID: token.userID}}
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