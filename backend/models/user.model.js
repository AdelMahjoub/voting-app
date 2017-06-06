/**
 * Node modules
 */
const bcrypt    = require('bcrypt');
const validator = require('validator');

/**
 * App modules
 */
const db = require('../services/db.service');

/**
 * User schema
 */
const userSchema = db.Schema({
  //username field
  username:{
    type: String,
    unique: true, //for indexing
    // the username is required
    required: 'Username is required.',
    //custom validators
    validate: [
      //the username should be alphanumeric only
      {
        validator: function(value) {
          return validator.isAlphanumeric(value);
        },
        msg: 'Username should not contain special characters.'
      },
      //the username length should be at least 4 characters
      {
        validator: function(value) {
          return value.length >= 4;
        },
        msg: 'Username length should be at least 4 characters.'
      },
      //the username is unique
      {
        isAsync: true,
        validator: function(value, respond) {
          User.findOne({username: value}, (err, doc) => {
            if(err) return console.log(err);
            //For the validation false means not valid, should return true if no doc found
            return respond(!Boolean(doc)); 
          });
        },
        msg: 'Username already in use.'
      }
    ]
  }, //End of username field

  //Email field
  email: {
    type: String,
    unique: true, //for indexing
    //the email is required
    required: 'Email is required.',
    //custom validators
    validate: [
      //the email should be a valid email address
      {
        validator: function(value) {
          return validator.isEmail(value);
        },
        msg: 'Email is not valid.'
      },
      //the email is unique
      {
        isAsync: true,
        validator: function(value, respond) {
          User.findOne({email: value}, (err, doc) => {
            if(err) return console.log(err);
            //For the validation false means not valid, should return true if no doc found
            return respond(!Boolean(doc));
          });
        },
        msg: 'Email adress already in use.'
      },
    ]
  },//End of email field

  //password field
  password: {
    type: String,
    //the password is required
    required: 'Password is required.',
    //minimum length of the password is 6 characters
    validate: {
      validator: function(value) {
        return value.length >= 6;
      },
      msg: 'Password length, 6 characters minimum.'
    }
  },//End of password field

  //signup date (date on which the user registered)
  signupDate: {
    type: Date,
    default: Date.now()
  },

  //posted polls, array of polls _ids, linked to polls collection
  polls: [{type: db.Schema.Types.ObjectId, ref: 'Poll'}],

  //optional fields
  firstName: {
    type: String,
    validate: {
      validator: function(value) {
        return validator.isAlpha(value);
      },
      msg: 'The firstname should not contains numbers or special chararacters.'
    }
  },
  lastName: {
    type: String,
    validate: {
      validator: function(value) {
        return validator.isAlpha(value);
      },
      msg: 'The lastname should not contains numbers or special chars.'
    }
  },
  age: {
    type: Number,
    validate: {
      validator: function(value) {
        return validator.isDecimal(value.toString());
      }
    }
  }
});

userSchema.pre('save', function(done) {
  let user = this;
  if(!user.isModified('password')) return done();
  bcrypt.genSalt(10, (err, salt) => {
    if(err) return done();
    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) return done();
      user.password = hash;
      done();
    });
  });
});

userSchema.methods.comparePasswords = function(guess, password, done) {
  bcrypt.compare(guess, password, function(err, isMatch) {
    return done(err, isMatch);
  });
}

/**
 * User class
 */
const User = db.model('User', userSchema);

module.exports = User;