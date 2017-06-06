/**
 * node modules
 */
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

/**
 * App modules
 * Services
 */
const usersService = require('../../services/user.service');
const pollService = require('../../services/poll.service');

//////////////////////////////
//express Router instance
/////////////////////////////
const api = express.Router();

/////////////////////////////
// Middlewares
/////////////////////////////
api.use(bodyParser.json());
api.use(
  expressJwt({
    secret: process.env.JWTSECRET,
    credentialsRequired: false,
    getToken: function fromHeader(req) {
      if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      return null
    }
  })
  .unless({
    path: [
      '/api',
      '/api/polls',
      '/api/auth/check-email',
      '/api/auth/check-username',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/verify-token'
      ]
  })
)


/**
 * Routes
 */
api.get('/api', (req, res, next) => {
  res.json({
    status: 'ok'
  })  
});

///////////////////////////////////////////////////////
// Get all polls, or a single poll
// depending if there is a querystring in the request
// the query string should have this format ?pollid=id
///////////////////////////////////////////////////////

api.get('/api/polls', (req, res, next) => {
  // console.log(req.query.pollid)
  // If the querystring is empty, return all polls
  if(!req.query.hasOwnProperty('pollid')) {
    pollService.getPolls((err, polls) => {
      return res.json({ polls });
    });
  } else {
    //If the querystring has pollid, return a single poll
    pollService.getPollById(req.query.pollid, (err, poll) => {
      return res.json({ poll })
    });
  }
});

///////////////////////////////////////////////////////
// Get a user polls
// the query string should have this format ?userid=id
///////////////////////////////////////////////////////

api.get('/api/polls/dashboard',(req, res, next) => {
  pollService.getUserPolls(req.query.userid, (err, polls) => {
    return res.json({ polls })
  });
});

////////////////
// Add a poll
////////////////

api.post('/api/dashboard/new', (req, res, next) => {
  pollService.addPoll(req.body, (errors) => {
    return res.json({errors});
  });
});

////////////////////
// Update a poll
// 
// req.body :
// { 
//  userId: string,
//  pollId: string,
//  title: string,
//  options:
//   [ ...{ label: string } ]
// }
////////////////////

api.put('/api/dashboard/update', (req, res, next) => {
  pollService.updatePoll(req.body, (errors) => {
    res.json({errors});
  });
});

////////////////////
// Remove a poll
// 
// req.body :
// { 
//  userId: string,
//  pollId: string,
// }
////////////////////

api.put('/api/dashboard/remove', (req, res, next) => {
  pollService.removePoll(req.body, (errors) => {
    res.json({errors});
  });
});

////////////////////////////
// Vote in a poll
// req.body :
// {
//   pollId: string,
//   userId: string,
//   optionId: string
// }
//
////////////////////////////

api.post('/api/polls/participate', (req, res, next) => {
  pollService.participate(req.body, (errors) => {
    res.json({errors});
  });
});

////////////////////////////
// Signup user
///////////////////////////

api.post('/api/auth/register', (req, res, next) => {
  usersService.register(req.body, (errors) => {
    return res.json({ errors });
  });
});

////////////////
// Login user
///////////////

api.post('/api/auth/login', (req, res, next) => {
  usersService.login(req.body, (errors, id) => {
    if(errors) return res.json({ errors });
    else {
      let jwtToken = jwt.sign({id: id}, process.env.JWTSECRET);
      res.json({ token: jwtToken });
    }
  })
});

///////////////////
// Check jwtToken
///////////////////

api.post('/api/auth/verify-token', (req, res, next) => {
  if(!req.body.token) {
    return res.json(false);
  } else {
    const token = req.body.token;
    jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
      if(err) return res.json(false);
      else {
        const id = decoded.id;
        usersService.verifyUser(id, (valid) => {
          return res.json({ valid, id});
        });
      }
    })
  }
});

//////////////////////////////////////////////
// Check if the posted email already exists
// For Async email validation from the client
//////////////////////////////////////////////

api.post('/api/auth/check-email', (req, res, next) => {
  usersService.checkEmail(req.body.email, (exist) => {
    return res.json({
      emailInUse: exist
    });
  });
});

////////////////////////////////////////////////
// Check if the posted username already exists
// For Async username validation from the client
/////////////////////////////////////////////////

api.post('/api/auth/check-username', (req, res, next) => {
  usersService.checkUsername(req.body.username, (exist) => {
    return res.json({
      usernameInUse: exist
    });
  });
});

///////////////////////////////////////////////////
// Check if the posted poll title already exists
// For Async poll title validation from the client
///////////////////////////////////////////////////

api.post('/api/polls/dashboard/check-title', (req, res, next) => {
  let pollId = req.body.pollId;
  let title = req.body.title;
  pollService.checkPollTitle(pollId, title, (exist) => {
    return res.json({exist});
  });
});

module.exports = api;