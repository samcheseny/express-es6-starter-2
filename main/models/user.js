const {Model} = require('./model');

class User extends Model {

    constructor() {

        super();

        this.table = "users";

        this.primaryKey = "id";

        this.model = {
            id: "",
            clientID: "",
            name: "",
            email: "",
            createdAt: "",
            updatedAt: ""
        };

    }

}

module.exports = User;
