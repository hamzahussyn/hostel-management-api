const express = require('express');
const { GetUserListing } = require('../services/user.service');
const router = express.Router();

router.get('/', GetUserListing);

module.exports = router;
