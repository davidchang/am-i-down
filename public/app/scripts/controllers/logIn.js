'use strict';

angular.module('publicApp')
  .controller('LogInCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
      Auth.isLoggedIn().then(function(loggedIn) {
          if(loggedIn && loggedIn.user)
              $location.path( '/main' );
      });
  }]);
