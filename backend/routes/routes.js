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

module.exports = router;