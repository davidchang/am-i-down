'use strict';

angular.module('publicApp')
  .controller('UserCtrl', ['$scope', '$routeParams', 'Auth', 'REST', function ($scope, $routeParams, Auth, REST) {
    Auth.isLoggedIn().then(function(loggedIn) {
      if(!loggedIn || !loggedIn.user)
        $location.path( '/login' );
    });

    try {
      REST.getAccountableLists($routeParams.userId, function(res) {
        if(!res || !res.data || !res.data.lists)
          $scope.lists = [];
        else
          $scope.lists = res.data.lists;
      });
    } catch(err) {
      $scope.lists = [];
    }
  }]);
