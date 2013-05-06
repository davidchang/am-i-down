'use strict';

angular.module('publicApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
      $scope.lists = [{
          name: 'list1',
          byDay: true,
          days: []
          //days is like new Date().valueOf() / 1000, on a scale of 0 to 100
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

      function truncatedDay(d) {
          d = d || new Date();
          return new Date(d.toString().split(' ', 4).join(' ').toString()).valueOf();
      }

      $scope.statusChange = function(i, isGood) {
          $scope.lists[i].days.push({ realTime: new Date(), dayTime: truncatedDay(), good: isGood});
      }

      $scope.showStatusForToday = function(i) {
          var truncatedToday = truncatedDay();
          return !_.find($scope.lists[i].days, function(day) {
              return day.dayTime == truncatedToday;
          });
      };
  }]);
