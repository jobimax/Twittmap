app.controller('serverController',['$scope','$resource', function ($scope, $resource) {
	var Tweet= $resource('/api/tweets');
	var tweetfilter = "";
	var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  	
  	var heatmap;
 	var liveTweets = new google.maps.MVCArray();
 	//var pointArray = new google.maps.MVCArray(liveTweets);
	heatmap = new google.maps.visualization.HeatmapLayer({
    	data: liveTweets,
    	radius: 25
 	});
  	heatmap.setMap($scope.map);

 //  	if(io !== undefined) {
 //      	// Storage for WebSocket connections
 //     	var socket = io.connect('/');

 //    	// This listens on the "twitter-steam" channel and data is 
 //    	// received everytime a new tweet is receieved.
 //  		socket.on('twitter-stream', function (data) {
 //  			if(data.text.search(tweetfilter)>=0){console.log("true");}
 //  			var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
 //  			//console.log(data.text.search(filter));
 //  			//if(data.text.search(filter)>0){
  				
 //  				liveTweets.push(tweetLocation);
 //  			//}
 //  			//$scope.$digest();
 //  			// var marker = new google.maps.Marker({
 //  			// 	position: tweetLocation,
 //  			// 	map: $scope.map
 //  			// });
 //  			// setTimeout(function(){
 //     //   			 marker.setMap(null);
 //     // 		},1000);
 //  		});
 //  		socket.on("connected",function(r){
 //  			socket.emit("start tweets");
 //  		});
	// }

	$scope.filterTweet = function(){
		//tweetfilter = $scope.filter;
		//liveTweets = new google.maps.MVCArray();
		if(io !== undefined) {
      	// Storage for WebSocket connections
	     	var socket = io.connect('/');

	    	// This listens on the "twitter-steam" channel and data is 
	    	// received everytime a new tweet is receieved.
	  		socket.on('twitter-stream', function (data) {
	  			//if(data.text.search($scope.filter)>=0){console.log("true");}
	  			//console.log("hello")
	  			//console.log(data.text)
	  			if (data.coordinates){
		            if (data.coordinates !== null){
		              //If so then build up some nice json and send out to web sockets
		              var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};
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

		                var outputPoint = {"lat": centerLat,"lng": centerLng};
		              }
		        	}
		      	}
		  			var tweetLocation = new google.maps.LatLng(outputPoint.lng,outputPoint.lat);
		  			//console.log(data.text.search(filter));
		  			if(data.text.search($scope.filter)>=0){
		  					console.log($scope.sentiment);
		  				if(data.Sentiment == $scope.sentiment || $scope.sentiment == 'all'){
							liveTweets.push(tweetLocation);
							console.log(data.text)
		  				}
		  				// console.log(data.text)
		  			}
	  			//$scope.$digest();
	  			// var marker = new google.maps.Marker({
	  			// 	position: tweetLocation,
	  			// 	map: $scope.map
	  			// });
	  			// setTimeout(function(){
	     //   			 marker.setMap(null);
	     // 		},1000);
	  		});
	  		socket.on("connected",function(r){
	  			socket.emit("start tweets");
	  		});
		}
	}
}]);
