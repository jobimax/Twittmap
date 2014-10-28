app.controller('serverController',['$scope','$resource', function ($scope, $resource) {
	var Tweet= $resource('/api/tweets')

  Tweet.query(function (results) {
    $scope.tweets = results;
  });

  $scope.tweets = []

	$scope.createTweet = function(){
		var tweet = new Tweet();
		tweet.name = $scope.tweetName;
		tweet.$save(function (result){
			$scope.tweets.push(result);
			$scope.tweetsName = '';
		});
	}
}]);
