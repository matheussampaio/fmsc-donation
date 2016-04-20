const ipn = require('paypal-ipn');
const express = require('express');
const paypal = express();

paypal.post('/', (req, res) => {
  res.status(200).send();
  ipn.verify(req.body, { allow_sandbox: true }, handlePayment);
});

function handlePayment(...argv) {
  console.log(argv);
}

module.exports = paypal;
