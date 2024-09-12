'use strict';
const express = require('express');

const router = express.Router();

const helloWorld = require('../controllers/helloWorld.controller');

router.get('/helloworld', helloWorld.helloWorld);

module.exports = router;
