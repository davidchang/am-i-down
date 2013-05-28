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

      $scope.newList = {
        useDesiredAsDefault : true
      };

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

      function truncatedDay(d) {
        d = d || new Date();
        return new Date(d.toString().split(' ', 4).join(' ').toString()).valueOf();
      }

      function save() {
        REST.saveLists($scope.lists);
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
