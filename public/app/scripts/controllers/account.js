'use strict';

angular.module('publicApp')
  .controller('AccountCtrl', ['$scope', '$location', 'Auth', 'REST', function ($scope, $location, Auth, REST) {
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
        REST.saveLists($scope.lists);
      }

      $scope.accountabilityLink = 'Loading...';
      REST.getOwnInviteLink(function(res) {
        if(res && res.data)
          $scope.accountabilityLink = res.data;
        else
          $scope.accountabilityLink = 'Error - please try reloading';
      });

      $scope.accountability = {};
      REST.getAccountabilityPartners(function(res) {
        $scope.accountability = res.data;
        console.log(res.data);
      });
  }]);
