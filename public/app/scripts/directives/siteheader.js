'use strict';

angular.module('publicApp')
  .directive('siteheader', function () {
    return {
      templateUrl: 'partials/siteheader.html',
      restrict: 'E',
      scope: { curPage: '@', invited: '=' },
      link: function postLink($scope, element, attrs) {
        $scope.changeStatus = function(accepted) {
          console.log(accepted);
          console.log($scope.invited.id);
        }
      }
    };
  });
