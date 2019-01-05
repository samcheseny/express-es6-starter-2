const {Pool} = require('pg');

class Model {

    constructor() {

        this.pool = new Pool({
            user: process.env.DB_USERNAME,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });

        this.table = "";

        this.primaryKey = "";

        this.model = null;

    }

    query(queryString, parameters = []) {
        return this.pool.query(queryString, parameters);
    }

    async findAll() {

        try {

            let {rows} = await this.query(`SELECT * FROM ${this.table}`);

            let data = [];

            rows.forEach(row => data.push(Object.assign(this.model, row)));

            return data;

        } catch (error) {
            throw Error(error);
        }

    }

    async findOne(id) {

        if (id === null || id === undefined) {
            throw Error("ID cannot be empty");
        }

        try {

            let {rows} = await this.query(
                `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = $1`,
                [id]
            );

            return Object.assign(this.model, rows[0]);

        } catch (error) {
            throw Error(error);
        }

    }

    async save(data) {

        if (typeof data !== 'object') {
            throw TypeError("Data must be an object");
        }

        if (data === {}) {
            throw Error("Data cannot be empty");
        }

        let columns = [];

        let parameters = [];

        Object.entries(data).forEach(([key, value]) => {
            columns.push(key);
            parameters.push(value);
        });

        let keys = columns.map((column, index) => `$${index + 1}`);

        let query = `INSERT INTO ${this.table}(${columns.join(",")}) VALUES (${keys}) RETURNING *`;

        try {

            let {rows} = await this.query(query, parameters);

            return Object.assign(this.model, rows[0]);

        } catch (error) {
            throw Error(error);
        }

    }

    async update(data, criteria) {

        if (typeof data !== 'object') {
            throw TypeError("Data must be an object");
        }

        if (data === {}) {
            throw Error("Data cannot be empty");
        }

        let columns = Object.entries(data).map(([key, value]) => `${key}=${value}`);

        let whereCriteria = Object.entries(criteria).map(([key, value]) => `${key}=${value}`);

        let query = `UPDATE ${this.table} SET ${columns.join(",")} WHERE ${whereCriteria.join(" AND ")} RETURNING *`;

        try {

            let {rows} = await this.query(query);

            return Object.assign(this.model, rows[0]);

        } catch (error) {
            throw Error(error);
        }
    }

    async findByCriteria(criteria) {

        try {

            let columns = [];

            let parameters = [];

            Object.entries(criteria).forEach(([key, value], index) => {
                columns.push(`${key}=$${index + 1}`);
                parameters.push(value);
            });

            let {rows} = await this.query(
                `SELECT * FROM ${this.table} WHERE ${columns.join(" AND ")}`,
                parameters
            );

            console.log( `SELECT * FROM ${this.table} WHERE ${columns.join(" AND ")}`);

            return Object.assign(this.model, rows[0]);

        } catch (error) {
            throw Error(error);
        }
    }
}

module.exports.Model = Model;
