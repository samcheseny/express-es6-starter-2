const {Model} = require('./model');

class User extends Model {

    constructor() {
        super();
    }

}

User.table = "users";

User.primaryKey = "id";

User.model = {
    id: "",
    clientID: "",
    name: "",
    email: "",
    createdAt: "",
    updatedAt: ""
};

module.exports = User;
