'use strict';

angular.module('publicApp')
  .controller('MainCtrl', ['$scope', '$location', 'Auth', 'REST', function ($scope, $location, Auth, REST) {
      Auth.isLoggedIn().then(function(loggedIn) {
        if(!loggedIn)
          $location.path( '/login' );
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

      $scope.newList = {};

      $scope.createNewList = function() {
        var toAdd = $scope.newList;
        toAdd.days = [];
        toAdd.startDate = new Date();
        toAdd.public = false;

        $scope.lists.push(toAdd);
        save();

        /*$scope.newListForm.$setPristine();
        $scope.newList = {
          useDesiredAsDefault : true
        };*/
      };

      function save() {
        REST.saveLists($scope.lists);
      }

      $scope.$on('saveListData', function() {
        save();
      });
  }]);
