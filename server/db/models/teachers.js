'use strict'

const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('teacher', {
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
    },
    schoolName: {
        type: Sequelize.STRING,
    },
    contactedOn: {
        type: Sequelize.DATE,
    },
    bounceType: {
        type: Sequelize.STRING,
    }
})

