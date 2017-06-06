/**
 * node modules
 */
const mongoose = require('mongoose');
const bluebird = require('bluebird');

//Set mongoose promises to bluebird
mongoose.Promise = bluebird;

//database connexion instance
const options = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  server: {
    socketOptions: {
      keepAlive: 1
    }
  }
};

const db = mongoose.connect(process.env.DB_URL, options);

module.exports = db;