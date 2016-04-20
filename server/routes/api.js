const express = require('express');
const api = express();

const paypal = require('../models/paypal');

api.use('/notification', paypal);

module.exports = api;
