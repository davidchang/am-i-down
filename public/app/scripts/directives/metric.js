'use strict';

angular.module('publicApp')
  .directive('metric', ['$rootScope', function ($rootScope) {
    return {
      templateUrl: 'partials/metric.html',
      restrict: 'E',
      scope: { data: '=', index: '@' },
      link: function postLink($scope, element, attrs) {
        function truncatedDay(d) {
          d = d || new Date();
          return new Date(d.toString().split(' ', 4).join(' ').toString()).valueOf();
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

        function save() {
          $rootScope.$broadcast('saveListData');
        }

        $scope.showStatusForToday = function(i) {
          var truncatedToday = truncatedDay();
          return !_.find($scope.data.days, function(day) {
            return day.dayTime == truncatedToday;
          });
        };

        $scope.statusChange = function(isGood, dateToUse) {
            var validDate = isValidDate($scope.data.backfillDate);
            if(dateToUse && !validDate) {
              console.log('error');
              return;
            }

            var time = dateToUse ? validDate : new Date();
            var truncatedBackfillDay = truncatedDay(time);
            var day = _.find($scope.data.days, function(day) {
                return day.dayTime == truncatedBackfillDay;
            });
            if(day)
              day.good = isGood;
            else
              $scope.data.days.push({ realTime: time, dayTime: truncatedBackfillDay, good: isGood});

            save();
            $scope.data.backfillDate = '';
        }

        $scope.getStatusForToday = function(i) {
            var truncatedToday = truncatedDay();
            var day = _.find($scope.data.days, function(day) {
                return day.dayTime == truncatedToday;
            });

            return day ? day.good : false;
        };

        $scope.undoToday = function(i) {
            var truncatedToday = truncatedDay();
            var day = _.find($scope.data.days, function(day) {
                return day.dayTime == truncatedToday;
            });

            var index = $scope.data.days.indexOf(day);
            $scope.data.days.splice(index, 1);

            save();
        };
      }
    };
  }]);
