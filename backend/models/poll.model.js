/**
 * App modules
 */
const db = require('../services/db.service');

/**
 * Poll schema, a user can have multiple polls
 */
const pollSchema = db.Schema({
  title       : String,                                           //Title of the poll
  postedBy    : {type: db.Schema.Types.ObjectId, ref: 'User'},    //Author's _id of the poll (User who posted the poll)
  createdAt   : {type: Date, default: new Date()},                //Date of creation
  participants: [{type: db.Schema.Types.ObjectId, ref: 'User'}],  //Participants _ids (Users who took part in this poll)
  options     : [{type: db.Schema.Types.ObjectId, ref: 'Option'}] //Poll's options _ids 
});

/**
 * Poll class
 */
const Poll = db.model('Poll', pollSchema);

module.exports = Poll;