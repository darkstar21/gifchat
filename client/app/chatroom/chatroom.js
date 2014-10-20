'use strict';

angular.module('gifchatApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chatroom', {
        url: '/chatroom',
        templateUrl: 'app/chatroom/chatroom.html',
        controller: 'ChatroomCtrl'
      });
  });