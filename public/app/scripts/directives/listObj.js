'use strict';

angular.module('publicApp')
  .directive('metric', function () {
    return {
      templateUrl: 'partials/listObj.html',
      restrict: 'E',
      scope: { listObj: '=', index: '@' },
      compile: function postCompile(scope, element, attrs) {
        return {
          post: function(scope) {
            console.log(scope);
            console.log(scope.listObj);
            console.log(scope.index);

            function truncatedDay(d) {
              d = d || new Date();
              return new Date(d.toString().split(' ', 4).join(' ').toString()).valueOf();
            }

            scope.showStatusForToday = function(i) {
              console.log(i);
              var truncatedToday = truncatedDay();
              return !_.find(scope.listObj.days, function(day) {
                return day.dayTime == truncatedToday;
              });
            };
          }}
      }
    };
  });
