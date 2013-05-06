'use strict';

angular.module('publicApp')
  .controller('MainCtrl', ['$scope', 'localStorageService', function ($scope, ls) {
      if(ls.get('lists'))
          $scope.lists = JSON.parse(ls.get('lists'));
      else {
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
      }

      $scope.showAddNewList = false;

      $scope.newName = '';
      $scope.newByDay = true;
      $scope.createNewList = function() {
          if(!$scope.newName)
              return;

          $scope.lists.push({ name: $scope.newName, byDay: $scope.newByDay, days: [] });
          $scope.newName = '';
          $scope.newByDay = true;
          $scope.showAddNewList = false;
          save();
      };

      function truncatedDay(d) {
          d = d || new Date();
          return new Date(d.toString().split(' ', 4).join(' ').toString()).valueOf();
      }

      function save() {
          ls.add('lists', JSON.stringify($scope.lists));
      }

      $scope.statusChange = function(i, isGood) {
          $scope.lists[i].days.push({ realTime: new Date(), dayTime: truncatedDay(), good: isGood});
          save();
      }

      $scope.showStatusForToday = function(i) {
          var truncatedToday = truncatedDay();
          return !_.find($scope.lists[i].days, function(day) {
              return day.dayTime == truncatedToday;
          });
      };

      $scope.getStatusForToday = function(i) {
          var truncatedToday = truncatedDay();
          var day = _.find($scope.lists[i].days, function(day) {
              return day.dayTime == truncatedToday;
          });

          return day ? day.good : false;
      };
      $scope.undoToday = function(i) {
          var truncatedToday = truncatedDay();
          var day = _.find($scope.lists[i].days, function(day) {
              return day.dayTime == truncatedToday;
          });

          var index = $scope.lists[i].days.indexOf(day);
          $scope.lists[i].days.splice(index, 1);
      };
  }]);
