'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                unique: true
            },
            clientID: {
                type: Sequelize.UUID,
                allowNull: false,
                onDelete: 'CASCADE',
                field: 'client_id',
                references: {model: 'clients', key: 'id', as: 'client_id'}
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique:true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
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

    down: (queryInterface, Sequelize) => queryInterface.dropTable('users')
};
