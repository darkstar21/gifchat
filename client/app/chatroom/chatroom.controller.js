'use strict';

angular.module('gifchatApp')
  .controller('ChatroomCtrl', function ($scope, Auth, $firebase) {
  	$scope.username = Auth.getCurrentUser().name
  	$scope.userMessage;
  	$scope.isLoggedIn = Auth.isLoggedIn;
  	$scope.privateMessage = false;
  	$scope.privateMessageHash;
  	$scope.privateMessageURL;
    $scope.usernameFriend;
    $scope.friendsName
    $scope.chosenPrivate=false;

  	var linkRef = new Firebase("https://fiery-torch-9779.firebaseio.com/usernames/"+$scope.username+ "/" +"messages");
  	var sync = $firebase(linkRef);
  	$scope.messages = sync.$asArray();

  	$scope.addMessage = function(text) {
    	$scope.messages.$add({username: $scope.username, text: text});
      $scope.friendsMessages.$add({username: $scope.username, text: text});
      $scope.userMessage = '';
  	}
    $scope.setFriendUsername = function(user){
      $scope.friendsName = user;
      $scope.chosenPrivate=true;
      var userRef = new Firebase("https://fiery-torch-9779.firebaseio.com/usernames/" + $scope.username + '/' +"messages"+ "/" + user);
      var otherUserRef = new Firebase("https://fiery-torch-9779.firebaseio.com/usernames/" + user + '/' +"messages"+ "/" + $scope.username);
      var otherSync = $firebase(otherUserRef)
      var sync = $firebase(userRef);
      $scope.friendsMessages = otherSync.$asArray();
      $scope.messages = sync.$asArray(); 
    }
  	$scope.addPrivateMessage = function(text) {
    	$scope.messages.$add({username: $scope.username, text: text});
    	$scope.userMessage = '';
  	}
    // $scope.message = 'Hello';

  });