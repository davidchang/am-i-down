'use strict';

angular.module('publicApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
      $scope.lists = [{
          name: 'list1',
          byDay: true,
          days: []
      }, {
          name: 'list2',
          byDay: false,
          days: []
      }];

      $scope.showAddNewList = false;

      $scope.newName = '';
      $scope.newByDay = true;
      $scope.save = function() {
          if(!$scope.newName)
              return;

          $scope.lists.push({ name: $scope.newName, byDay: $scope.newByDay, days: [] });
          $scope.newName = '';
          $scope.newByDay = true;
          $scope.showAddNewList = false;
      };

      $scope.notGood = function(i) {
          $scope.lists[i].days.push(new Date());
      };

      $scope.showStatusForToday = function(i) {
          return !$scope.lists[i].days.length;
      };
  }]);
