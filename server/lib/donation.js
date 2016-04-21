const ipn = require('paypal-ipn');
const express = require('express');
const donation = express();

const Image = require('./image');

donation.post('/', (req, res) => {
  res.status(200).send();
  ipn.verify(req.body, { allow_sandbox: true }, (error, response) => {
    if (!error) {
      if (response === 'VERIFIED') {
        handlePayment(req.body);
      }
    }
  });
});

function handlePayment(argv) {
  Image.handle(argv);
}

module.exports = donation;
