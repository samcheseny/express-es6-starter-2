const {Model} = require('./model');

class AccessToken extends Model {

    constructor() {
        super();
    }

}

AccessToken.table = "access_tokens";

AccessToken.primaryKey = "id";

AccessToken.model = {
    id: "",
    userID: "",
    clientID: "",
    token: "",
    expirationDate: "",
    scope: "",
    revoked: false,
    createdAt: "",
    updatedAt: ""
};

module.exports = AccessToken;