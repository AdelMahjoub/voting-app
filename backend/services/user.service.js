/**
 * App modules
 * Models
 */
const User = require('../models/user.model');

/**
 * Signup user
 * @param { username: string, email: string, password: string } data
 * @param { function(string[]): response } callback  
 */
const registerUser = (data, callback) => {
  //user instance with the provided data
  let user = new User({
    username: data['username'],
    email: data['email'],
    password: data['password']
  });
  //error messages array
  let validationResult = [];
  User.create(user, (err, doc) => {
    if(err) {
      //loop through err.errors properties and push the schema validation messages
      //into the validationResult array
      Object.keys(err.errors).forEach(key => {
        validationResult.push(err.errors[key]['message']);
      });
    }
    //if validationResult is empty that means the user was added, else the data provided are not valid
    return callback(validationResult);
  });
}

/**
 * 
 * @param { identifier: string (username or password), password: string } data  
 * @param { function(errors): response } callback
 */
const loginUser = (data, callback) => {
  let validationResult = [];
  User.findOne({$or: [{username: data.identifier}, {email: data.identifier}]}, (err, user) => {
    if(err) {
      validationResult.push('unexpected error');
      return callback(validationResult);
    }
    if(!user) {
      validationResult.push('Invalid username, email or password');
      return callback(validationResult);
    }
    user.comparePasswords(data.password, user.password, (err, isMatch) => {
      if(err) {
        validationResult.push('unexpected error');
        return callback(validationResult);
      }
      if(!isMatch) {
        validationResult.push('Invalid username, email or password');
        return callback(validationResult);
      }
      return callback(null, user._id);
    });
  });
}

/**
 * 
 * @param {*} id 
 * @param {*} callback 
 */
const verifyUser = (id, callback) => {
  User.findById(id, (err, user) => {
    if(err) return callback(false);
    return callback(Boolean(user));
  });
}

/**
 * Check if the email is in use
 * @param {*} email 
 * @param {*} callback 
 */
const checkEmail = (email, callback) => {
  User.findOne({email: email}, (err, doc) => {
    return callback(Boolean(doc));
  });
}

/**
 * Check if the username is in use
 * @param {*} username 
 * @param {*} callback 
 */
const checkUsername = (username, callback) => {
  User.findOne({username: username}, (err, doc) => {
    return callback(Boolean(doc));
  });
}

module.exports = usersService = {
  register: registerUser,
  login: loginUser,
  checkEmail,
  checkUsername,
  verifyUser
};