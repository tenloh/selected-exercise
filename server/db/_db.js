var path = require('path');
var Sequelize = require('sequelize');
const dev = require('../../env/development');

var db = new Sequelize(dev.DATABASE_URI, {
  logging: dev.LOGGING,
  native: dev.NATIVE
});


module.exports = db;