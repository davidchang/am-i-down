'use strict';

angular.module('publicApp')
  .directive('newMetricForm', ['$rootScope', function ($rootScope) {
    return {
      templateUrl: 'partials/newMetricForm.html',
      restrict: 'E',
      scope: { lists : '=' },
      link: function postLink($scope, element, attrs) {

        $scope.newList = {};

        function save() {
          $rootScope.$broadcast('saveListData');
        }

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

      }
    };
  }]);
