const {Model} = require('./model');

class AccessToken extends Model {

    constructor() {

        super();

        this.table = "access_tokens";

        this.primaryKey = "id";

        this.model = {
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

    }

}

module.exports = AccessToken;