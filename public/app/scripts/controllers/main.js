'use strict';

angular.module('publicApp')
  .controller('MainCtrl', ['$scope', 'localStorageService', '$location', 'Auth', function ($scope, ls, $location, Auth) {
      if(!Auth.isLoggedIn())
          $location.path( '/login' );

      if(ls.get('lists'))
          $scope.lists = JSON.parse(ls.get('lists'));
      else {
          $scope.lists = [{
              name: 'list1',
              byDay: true,
              days: []
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
          save();
      };

      function truncatedDay(d) {
          d = d || new Date();
          return new Date(d.toString().split(' ', 4).join(' ').toString()).valueOf();
      }

      function save() {
          ls.add('lists', JSON.stringify($scope.lists));
      }

function isValidDate(date)
{
    var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var d = matches[2];
    var m = matches[1] - 1;
    var y = matches[3];
    var composedDate = new Date(y, m, d);
    return (composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y) ? composedDate : false;
}

      $scope.statusChange = function(i, isGood, dateToUse) {
          var validDate = isValidDate($scope.lists[i].backfillDate);
          if(dateToUse && !validDate) {
            console.log('error');
            return;
          }

          var time = dateToUse ? validDate : new Date();
          var truncatedBackfillDay = truncatedDay(time);
          var day = _.find($scope.lists[i].days, function(day) {
              return day.dayTime == truncatedBackfillDay;
          });
          if(day)
            day.good = isGood;
          else
            $scope.lists[i].days.push({ realTime: time, dayTime: truncatedBackfillDay, good: isGood});

          save();
          $scope.lists[i].backfillDate = '';
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

          save();
      };
  }]);
