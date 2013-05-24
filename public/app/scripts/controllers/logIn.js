'use strict';

angular.module('publicApp')
  .controller('LogInCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
      if(Auth.isLoggedIn())
          $location.path( '/main' );
  }]);
