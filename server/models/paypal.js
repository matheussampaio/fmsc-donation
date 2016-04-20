const request = require('request');
const express = require('express');
const paypal = express();

// receive IPN
paypal.post('/', (req, res) => {
  console.log(req, res);
  res.status(200).send();

  replyIPN(req, res).then(() => {
    handlePayment(req);
  });
});


function replyIPN(req, res) {
  console.log('reply ipn');
  return Promise.resolved();
}

/**
 * TODO
 */
function handlePayment(req) {
  console.log('handlePayment');
}

module.exports = paypal;
