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
module.exports.addTweet = function (req, res) {
	var tweet = new Tweet();
	tweet.text = req.text;
	tweet.lat = req.coordinates.coordinates[0];
	tweet.lng = req.coordinates.coordinates[1];
	//console.log(tweet.text)
	tweet.save();
}