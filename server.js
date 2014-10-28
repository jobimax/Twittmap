var express 		 = require('express'),
	app				 = express(),
	bodyParser		 = require('body-parser'),
	mongoose		 = require('mongoose'),
	serverController = require('./server/controllers/controller');

mongoose.connect('mongodb://localhost:27017/Twittmap');

app.use(bodyParser());

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/views/index.html')
});

app.use('/js', express.static(__dirname + '/client/js'))

app.get('/api/tweets', serverController.list);
app.post('/api/tweets', serverController.create);

app.listen(3000,function(){
	console.log('I\'m Listening...');
});