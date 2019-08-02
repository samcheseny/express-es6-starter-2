const {Model} = require('./model');

class RefreshToken extends Model {

    constructor() {
        super();
    }

}

RefreshToken.table = "refresh-tokens";

RefreshToken.primaryKey = "id";

RefreshToken.model = {
    id: "",
    userID: "",
    clientID: "",
    refreshToken: "",
    revoked: false,
    createdAt: "",
    updatedAt: ""
};

module.exports = RefreshToken;