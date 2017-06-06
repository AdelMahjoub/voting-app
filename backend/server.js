/**
 * node modules
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

/**
 * App modules
 */
const routes = require('./routes/routes');

//express instance
const app = express();

//server port number
app.set('port', process.env.PORT || 3000);

//Disable express server signature
app.disable('x-powered-by');

/**
 * Middlewares
 */
//app.use(cors);
//Helmet middleware on production env
if(app.get('env') === 'production') {
  app.enable('trust-proxy');
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.frameguard({
    action: 'deny'
  }));
}

app.use(routes);
app.use(express.static(path.resolve(__dirname, 'public')));
app.use('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

/**
 * Start server
 */
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});
