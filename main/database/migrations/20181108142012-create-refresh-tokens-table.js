'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.createTable('refresh_tokens', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true
            },
            userID: {
                type: Sequelize.UUID,
                allowNull: true,
                onDelete: 'CASCADE',
                field: 'user_id',
                references: {model: 'users', key: 'id', as: 'user_id'}
            },
            clientID: {
                type: Sequelize.UUID,
                allowNull: false,
                onDelete: 'CASCADE',
                field: 'client_id',
                references: {model: 'clients', key: 'id', as: 'client_id'}
            },
            refreshToken: {
                type: Sequelize.STRING,
                allowNull: false,
                field: 'refresh_token'
            },
            revoked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                field: 'created_at'
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                field: 'updated_at'
            }
        });

    },

    down: (queryInterface, Sequelize) => queryInterface.dropTable('refresh-tokens')

};
