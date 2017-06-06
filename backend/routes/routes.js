/**
 * node modules
 */
const express = require('express');

/**
 * App modules
 */
const api = require('./api/voting.api');

const router = express.Router();

router.use(api);

router.use((req, res, next) => {
  res.json({ status: '404' });
});

module.exports = router;