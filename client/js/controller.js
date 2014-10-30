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
	  			if(data.text.search($scope.filter)>=0){console.log("true");}
	  			var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
	  			//console.log(data.text.search(filter));
	  			if(data.text.search($scope.filter)>=0){
	  				liveTweets.push(tweetLocation);
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
