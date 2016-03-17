var path = require('path');

exports.index = function(req, res) {
  res.sendFile(path.resolve('www/index.html'));
};
