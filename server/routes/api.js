const express = require('express');
const api = express();

const donation = require('../lib/donation');

api.use('/notification', donation);

module.exports = api;
