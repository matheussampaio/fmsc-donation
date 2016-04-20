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


function replyIPN(req) {
  console.log('reply ipn');
  console.log(req.get('host'), req.get('body'));

  return new Promise(resolve => {
    request.post({ url: req.get('host'), formData: req.get('body') }, (error, response, body) => {
      console.log(error, response, body);
      resolve();
    });
  });
}

/**
 * TODO
 */
function handlePayment(req) {
  console.log('handlePayment');
}

module.exports = paypal;
