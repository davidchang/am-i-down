'use strict';

angular.module('publicApp')
  .directive('heatmap', function () {
    return {
      template: '<div id="mymap{{id}}"></div>',
      restrict: 'E',
      scope: { id: '@', data: '=' },
      link: function postLink(scope, element, attrs) {
        var oneYearAgo = new Date();
        //oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        setTimeout(function() {
            var cal = new CalHeatMap();
            cal.init({
              id: 'mymap' + scope.id,
              domain: 'week',
              subDomain: 'day',
              range: 52,
              data: scope.data,
              start: oneYearAgo
            });
        });
      }
    };
  });
