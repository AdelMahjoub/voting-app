/**
 * App modules
 */
const db = require('../services/db.service');

/**
 * Poll's option schema, a poll have at least two options
 */
const optionSchema = db.Schema({
  label   : String,                                     //Option's name
  votes   : {type: Number, default: 0},                 //Votes counter(How often the option was voted)
  partOf: {type: db.Schema.Types.ObjectId, ref: 'Poll'} //Poll's _id which had this option
});

/**
 * Option class
 */
const Option = db.model('Option', optionSchema);

module.exports = Option;