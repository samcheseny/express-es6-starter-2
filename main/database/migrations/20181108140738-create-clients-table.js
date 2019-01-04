'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.createTable('clients', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            secret: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                field: 'created_at'
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                field: 'updated_at'
            }
        });

    },

    down: (queryInterface, Sequelize) => queryInterface.dropTable('clients')

};
