var mongoose = require('mongoose');

module.exports = mongoose.model('Tweet', {
   text: String,
   lat: {type:Number},
   lng: {type:Number}
});