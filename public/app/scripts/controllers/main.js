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

      function truncatedDay(d) {
          d = d || new Date();
          var truncatedD = d.toString().split(' ', 4).join(' ').toString();
      }

      $scope.notGood = function(i) {
          $scope.lists[i].days.push({ realTime: new Date(), dayTime: truncatedDay()});
      };

      $scope.showStatusForToday = function(i) {
          var truncatedToday = truncatedDay();
          return !_.find($scope.lists[i].days, function(day) {
              return day.dayTime == truncatedToday;
          });
      };

    setTimeout(function() {
        var oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        for(var i = 0; i < 2; ++i) {
          var cal = new CalHeatMap();
          cal.init({
              id: 'heatmap' + i,
              domain: 'year',
              subDomain: 'day',
              range: 1,
              data: $scope.lists[i].days,
              start: oneYearAgo
          });
        }
    }, 5000);
  }]);
