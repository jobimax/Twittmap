var express 		 = require('express'),
	app				 = express(),
	bodyParser		 = require('body-parser'),
	mongoose		 = require('mongoose'),
	twitter 		 = require('twitter'),
	credentials	     = require('./credentials.js'),
    http             = require('http'),
    server           = http.createServer(app),
    io               = require('socket.io').listen(server),
    Tweet            = require('./server/models/tweet'),
    SNSClient        = require('aws-snsclient'),
	serverController = require('./server/controllers/controller');

var twit = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});
var config = {
    "USER"    : "",
    "PASS"    : "",
    "HOST"    : "ec2-54-174-18-51.compute-1.amazonaws.com",
    "PORT"    : "27017",
    "DATABASE" : "Twittmap"     };
var dbPath  = "mongodb://"+config.USER + ":"+     config.PASS + "@"+     config.HOST + ":"+    config.PORT + "/"+     config.DATABASE;
var auth = {
    region:'us-east-1',
    account:'486347889594',
    topic:'Twittmap'
}
var snsclient = SNSClient(auth, function(err, message) {
    if (err) {
        throw err;
    }
    body = JSON.parse(message.Message);
    io.emit("twitter-stream",body);
    console.log(JSON.stringify(body));
});


stream = null;
server.listen(process.env.PORT || 8081)

//mongoose.connect('mongodb://localhost:27017/Twittmap');
mongoose.connect('mongodb://ec2-54-173-177-129.compute-1.amazonaws.com:27017/Twittmap')
app.use(bodyParser());

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/views/index.html')
});

app.use('/js', express.static(__dirname + '/client/js'))

app.get('/api/tweets', serverController.list);
app.post('/api/tweets', serverController.create);
app.post('/receive', snsclient);
// app.post('/sns',function (req,res){
//     body = req.Message
// });

// app.listen(3000,function(){
// 	console.log('I\'m Listening...');
// });

io.sockets.on('connection',function(socket){
    console.log('Connected');
});
//Stream database to client
// io.sockets.on('connection',function(socket){
//     socket.on('start tweets', function(){
//         var stream2 = Tweet.find().stream();
//         stream2.on('data',function(doc){
//             //console.log(doc.text)
//             socket.emit("twitter-stream",doc);
//         }).on('error',function(err){
//             console.log(err)
//         });
//     });
//     socket.emit("connected");
// });


var AWS = require('aws-sdk'),
    awsCredentialsPath = './aws.credentials.json',
    sqsQueueUrl ='https://sqs.us-east-1.amazonaws.com/486347889594/Twittmap',
    sqs;
    AWS.config.loadFromPath(awsCredentialsPath);
    sqs = new AWS.SQS();

// //Twitter stream to mongodb
twit.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(stream) {
      stream.on('data', function(data) {
          // Does the JSON result have coordinates
          if (data.coordinates){
            if (data.coordinates !== null){
              //If so then build up some nice json and send out to web sockets
              var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};
              //console.log(data.coordinates.coordinates[0]);
              //console.log(data.text);
              sqs.sendMessage({
                                MessageBody: JSON.stringify(data), /* required */
                                QueueUrl: sqsQueueUrl, /* required */
                                DelaySeconds: 0,
                               },function (err,data) {
                                    if(err) console.log(err,err.stack);
                                    else    console.log(data);
                                    });
              serverController.addTweet(data);
              //socket.broadcast.emit("twitter-stream", outputPoint);

              //Send out to web sockets channel.
              //socket.emit('twitter-stream', outputPoint);
            }
            else if(data.place){
              if(data.place.bounding_box === 'Polygon'){
                // Calculate the center of the bounding box for the tweet
                var coord, _i, _len;
                var centerLat = 0;
                var centerLng = 0;

                for (_i = 0, _len = coords.length; _i < _len; _i++) {
                  coord = coords[_i];
                  centerLat += coord[0];
                  centerLng += coord[1];
                }
                centerLat = centerLat / coords.length;
                centerLng = centerLng / coords.length;

                // Build json object and broadcast it
                var outputPoint = {"lat": centerLat,"lng": centerLng};
                //socket.broadcast.emit("twitter-stream", outputPoint);
                //console.log(data.coordinates.coordinates[0]);
                serverController.addTweet(data);
              }
            }
          }
          stream.on('limit', function(limitMessage) {
            return console.log(limitMessage);
          });

          stream.on('warning', function(warning) {
            return console.log(warning);
          });

          stream.on('disconnect', function(disconnectMessage) {
            return console.log(disconnectMessage);
          });
      });
  });
