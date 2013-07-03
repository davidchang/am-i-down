'use strict';

angular.module('publicApp')
  .controller('UserCtrl', ['$scope', '$location', '$routeParams', 'Auth', 'REST', function ($scope, $location, $routeParams, Auth, REST) {
    Auth.isLoggedIn().then(function(loggedIn) {
      if(!loggedIn || !loggedIn.user)
        $location.path( '/login' );
    });

    $scope.name = '';

    try {
      REST.getAccountableLists($routeParams.userId, function(res) {
        if(!res || !res.data || !res.data.lists)
          $scope.lists = [];
        else
          $scope.lists = res.data.lists;

        $scope.name = res && res.data ? res.data.name : '';
      });
    } catch(err) {
      $scope.lists = [];
    }
  }]);
