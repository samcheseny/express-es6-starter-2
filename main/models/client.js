const {Model} = require('./model');

class Client extends Model {

    constructor() {
        super();
    }

}

Client.table = "clients";

Client.primaryKey = "id";

Client.model = {
    id: "",
    name: "",
    secret: "",
    active: false,
    createdAt: "",
    updatedAt: ""
};

module.exports = Client;