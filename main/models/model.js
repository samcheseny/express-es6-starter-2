const {Pool} = require('pg');

class Model {

    constructor() {

        this.pool = new Pool();

        this.table = "";

        this.primaryKey = "";

        this.model = null;

    }

    query(queryString, parameters = []) {
        return this.pool.query(queryString, parameters);
    }

    static async getAll() {

        const {rows} = await this.query(`SELECT * FROM ${this.table}`);

        let data = [];

        rows.forEach(row => data.push(Object.assign(this.model, row)));

        return data;

    }

    static async getOne(id) {

        const {rows} = await this.query(
            `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = $1`,
            [id]
        );

        return Object.assign(this.model, rows[0]);

    }

}

module.exports.Model = Model;
