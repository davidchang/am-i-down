'use strict';

angular.module('publicApp')
  .controller('DetailedCtrl', ['$scope', '$location', 'Auth', 'REST', function ($scope, $location, Auth, REST) {
      $scope.invitedData = {};

      Auth.isLoggedIn().then(function(loggedIn) {
        if(!loggedIn || !loggedIn.user)
          $location.path( '/login' );

        if(loggedIn.invite)
          $scope.invitedData = loggedIn.invite;
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
        console.log('saving data');
        REST.saveLists($scope.lists);
      }

      $scope.autosave = false;

      $scope.$on('saveListData', function() {
        console.log('received saveListData event');
        $scope.autosave && $scope.save();
      });
  }]);
