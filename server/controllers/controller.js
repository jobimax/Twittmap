var Tweet = require('../models/tweet');

module.exports.create = function (req, res) {
  var tweet = new Tweet(req.body);
  tweet.save(function (err, result) {
    res.json(result);
  });
}

module.exports.list = function (req, res) {
  Tweet.find({}, function (err, results) {
    res.json(results);
  });
}