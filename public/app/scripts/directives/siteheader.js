'use strict';

angular.module('publicApp')
  .directive('siteheader', ['REST', function (REST) {
    return {
      templateUrl: 'partials/siteheader.html',
      restrict: 'E',
      scope: { curPage: '@', invited: '=' },
      link: function postLink($scope, element, attrs) {
        $scope.changeStatus = function(accepted) {
          REST.acceptOrRejectInvitation(accepted, function(res) {
            if(res.data.success) {
              if(accepted)
                $scope.accepted = true;
            }
          });
        }
      }
    };
  }]);
