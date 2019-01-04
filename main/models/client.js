const {Model} = require('./model');

class Client extends Model {

    constructor() {

        super();

        this.table = "clients";

        this.primaryKey = "id";

        this.model = {
            id: "",
            name: "",
            secret: "",
            active: false,
            createdAt: "",
            updatedAt: ""
        };

    }

}

module.exports = Client;