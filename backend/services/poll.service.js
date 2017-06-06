/**
 * App modules
 * Models
 */
const User = require('../models/user.model');
const Poll = require('../models/poll.model');
const Option = require('../models/option.model');

/**
 * Get all polls
 * @param { function(error: any, polls: Poll[]): response } callback
 */
const getPolls = function(callback) {
  Poll.find()
    .populate('options postedBy', 'label votes username')
    .select('-__v')
    .exec((err, docs) => {
      if(err) return callback(err, null);
      return callback(null, docs);
    });
}

/**
 * Get a user polls
 * @param {*} userId 
 * @param {*} callback 
 */
const getUserPolls = function(userId, callback) {
  Poll.find({ postedBy: userId })
    .populate('options postedBy', 'label votes username')
    .select('-__v')
    .exec((err, docs) => {
      if(err) return callback(err, null);
      return callback(null, docs);
    });
}

/**
 * Get a poll by _id
 * @param {*} pollId 
 * @param {*} callback 
 */
const getPollById = function(pollId, callback) {
  Poll.findById(pollId)
    .populate('options postedBy', 'label votes username')
    .select('-__v')
    .exec((err, doc) => {
      if(err) return callback(err, null);
      return callback(null, doc);
    });
}

/**
 * Post a Poll
 * @param { userId: string, title: string, options: [ ... { label: string } ] } data
 * 
 * @param { function(errors: string[]): response } callback 
 */
const addPoll = function(data, callback) {
  /* validate posted data */
  let errors = [];
  errors = validateSubmittedPollData(data);
  if(errors.length > 0) return callback(errors);

  /* posted data are valid           */
  /* check for duplicate poll titles */
  let candidateTitle = new RegExp(data.title, 'i');
  
  Poll.findOne({title: candidateTitle}, (err, doc) => {
    if(err) {
      errors.push('Unexpected error, please try again.');
      return callback(errors);
    }
    //A poll by this title already exist
    if(doc) {
      errors.push(`A poll by the title of: '${doc.title}' already exist.`);
      return callback(errors);
    }
    /* no duplicate poll titles                     */
    /* create a new poll and update the collections */
    User.findById(data.userId, (err, user) => {
      //Unexpected error
      if(err) {
        errors.push('Unexpected error, please try again.');
        return callback(errors);
      }
      //User not found
      if(!user) {
        errors.push('User not found.');
        return callback(errors);
      }
      //instanciate a new poll document without options
      let newPoll = new Poll({
        title: data.title,
        postedBy: user._id,
      });
      //instanciate new options
      let options = [];
      data.options.forEach((option, index) => {
        let newOption = new Option({
          label: option.label,
          partOf: newPoll._id
        });
        //temporary store the options
        options.push(newOption);
        //update the new poll options field
        newPoll.options.push(newOption._id);
      });
      //Insert the options in the options collection
      Option.insertMany(options, (err) => {
        if(err) {
          errors.push('Unexpected error, please try again.');
          return callback(errors);
        }
        //Insert the new poll in the polls collection
        Poll.create(newPoll, (err) => {
          if(err) {
            errors.push('Unexpected error, please try again.');
            return callback(errors);
          }
          //Update the user polls
          User.findByIdAndUpdate(user._id, {$push: {polls: newPoll._id}}, (err, updatedUser) => {
            if(err) {
              errors.push('Unexpected error, please try again.');
              return callback(errors);
            }
            //At this point errors should be empty
            //And the collections were updated
            return callback(errors);
          });
        });
      });
    });
  });
}

/**
 * Update a poll
 * 
 * @param {userId: string, pollId: string, title: string, options: [...{label: string}]} data 
 * @param {function(errors: string[]): response} callback 
 */
const updatePoll = function(data, callback) {
  let errors = [];
  User.findOneAndUpdate({_id: data.userId}, {$pull: {polls: data.pollId}}, (err, user) => {
    if(err) {
      errors.push('Unexpected error:' + err);
      return callback(errors);
    }
    if(!user) {
      errors.push('User not found.');
      return callback(errors);
    }
    Option.remove({partOf: data.pollId}, (err) => {
      if(err) {
        errors.push('Unexpected error:' + err);
        return callback(errors);
      }
      Poll.remove({_id: data.pollId}, (err) => {
        if(err) {
          errors.push('Unexpected error:' + err);
          return callback(errors);
        }
        let newPollData = {
          userId: data.userId,
          title: data.title,
          options: data.options
        };
        addPoll(newPollData, callback); 
      });
    });
  });
}

/**
 * Remove a poll
 * 
 * @param {userId: string, pollId: string} data 
 * @param {function(errors: string[]): response} callback 
 */
const removePoll = function(data, callback) {
  let errors = [];
  User.findOneAndUpdate({_id: data.userId}, {$pull: {polls: data.pollId}}, (err, user) => {
    if(err) {
      errors.push('Unexpected error:' + err);
      return callback(errors);
    }
    if(!user) {
      errors.push('User not found.');
      return callback(errors);
    }
    Option.remove({partOf: data.pollId}, (err) => {
      if(err) {
        errors.push('Unexpected error:' + err);
        return callback(errors);
      }
      Poll.remove({_id: data.pollId}, (err) => {
        if(err) {
          errors.push('Unexpected error:' + err);
          return callback(errors);
        }
        return callback(errors);
      });
    });
  });
}

/**
 * 
 * @param {userId: string, pollId: string, optionId: string} data 
 */
const participate = function(data, callback) {
  let errors = [];

  //Check the userId
  User.findById(data.userId, (err, user) => {
    if(err) {
      errors.push('Undexpected Error ' + err);
      return callback(errors);
    }
    if(!user) {
      errors.push('Your browser did something unexpected.');
      return callback(errors);
    }

    //Check the pollId
    Poll.findOne({_id: data.pollId}, (err, poll) => {
      if(err) {
        errors.push('Undexpected Error ' + err);
        return callback(errors);
      }
      if(!poll) {
        errors.push('Sorry this Poll no longer exists.');
        return callback(errors);
      }

      // Check if the user already voted in this poll
      if(poll.participants.indexOf(user._id) !== -1) {
        errors.push('You have already voted in this poll.');
        return callback(errors);
      }

      //Check the optionId
      Option.findOneAndUpdate({_id: data.optionId}, {$inc: {votes: 1}},(err, option) => {
        if(err) {
          errors.push('Undexpected Error ' + err);
          return callback(errors);
        }
        if(!option) {
          errors.push('Sorry this option no longer exists, the poll\'s author may have updated the poll.');
          return callback(errors);
        }
        
        // Update the poll
        Poll.update({_id: poll._id}, {$push: {participants: user._id}}, (err, res) => {
          if(err) {
            errors.push('Undexpected Error ' + err);
            return callback(errors);
          }
          return callback(errors);
        });
      });
    });
  });
}

/**
 * Validate posted Poll's data
 * @param { userId: string, title: string, options: [ ... { label: string } ] } data
 */
const validateSubmittedPollData = function(data) {
  let errors = [];
  let requiredProperties = ['userId', 'title', 'options'];
  //data should have all the required properties
  let missingProps = 0;
  requiredProperties.forEach(prop => {
    if(!data.hasOwnProperty(prop)) {
      missingProps++;
    }
  });
  if(missingProps > 0) {
    errors.push('Invalid poll data.');
    return errors;
  }
  //data options should be an array
  if(!Array.isArray(data.options)) {
    errors.push('Invalid poll data.');
    return errors;
  }
  //data should have at least two options
  if(data.options.length < 2) {
    errors.push('A poll should have at least 2 options.');
    return errors;
  }
  //Check for duplicate options
  let duplicates = 0;
  data.options.forEach(option => {
    let label = option.label.toLowerCase();
    let temp = [];
    temp = data.options.filter(obj => obj.label.toLowerCase() === label);
    if(temp.length > 1) duplicates++;
  });
  if(duplicates > 0) {
    errors.push('There are duplicate options.');
    return errors;
  }
  return errors;
}

/**
 * 
 * @param {*} pollId 
 * @param {*} title 
 * @param {*} callback 
 */
const checkPollTitle = function(pollId, title, callback) {
  Poll.findOne({_id: {$ne: pollId}, title: title}, (err, poll) => {
    if(err) return callback(false);
    return callback(Boolean(poll));
  });
}


/**
 * 
 */
module.exports = pollService = {
  getPolls,
  getPollById,
  addPoll,
  updatePoll,
  getUserPolls,
  checkPollTitle,
  removePoll,
  participate
}