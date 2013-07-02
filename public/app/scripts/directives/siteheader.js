'use strict';

angular.module('publicApp')
  .directive('siteheader', function () {
    return {
      templateUrl: 'partials/siteheader.html',
      restrict: 'E',
      scope: { curPage: '@' }
    };
  });
