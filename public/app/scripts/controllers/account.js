'use strict';

angular.module('publicApp')
  .controller('AccountCtrl', ['$scope', '$location', 'Auth', 'REST', function ($scope, $location, Auth, REST) {
      $scope.urlName = '';
      Auth.isLoggedIn().then(function(loggedIn) {
          if(!loggedIn && !loggedIn.user)
              $location.path( '/login' );

        $scope.urlName = loggedIn.username;
      });

      try {
          REST.getLists(function(res) {
            if(!res || !res.data || !res.data.lists)
              $scope.lists = [];
            else
              $scope.lists = res.data.lists;
          });
      } catch(err) {
          $scope.lists = [];
      }

      $scope.save = function() {
        REST.saveLists($scope.lists);
      }
  }]);
