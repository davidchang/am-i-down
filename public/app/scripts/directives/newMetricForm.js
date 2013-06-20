'use strict';

angular.module('publicApp')
  .directive('newMetricForm', ['$rootScope', function ($rootScope) {
    return {
      templateUrl: 'partials/newMetricForm.html',
      restrict: 'E',
      scope: { lists : '=' },
      link: function postLink($scope, element, attrs) {

        $scope.newList = {};
        $scope.suggestions = [
          { name: 'Porn', desiredOutcome: 'Didn\'t look at porn', oppositeOutcome: 'Looked at porn' },
          { name: 'Fights', desiredOutcome: 'Didn\'t fight with my wife', oppositeOutcome: 'Fought with my wife' },
          { name: 'Imgur', desiredOutcome: 'Didn\'t go on Imgur', oppositeOutcome: 'Went on Imgur' },
          { name: 'Reddit', desiredOutcome: 'Didn\'t go on Reddit', oppositeOutcome: 'Went on Reddit' },
          { name: 'Digg', desiredOutcome: 'Didn\'t go on Digg', oppositeOutcome: 'Went on Digg' },
          { name: 'Programming', desiredOutcome: 'Programmed recreationally', oppositeOutcome: 'Didn\'t program recreationally' },
          { name: 'Sex', desiredOutcome: 'Had sex!', oppositeOutcome: 'Didn\'t have sex :/' },
          { name: 'Running', desiredOutcome: 'Went on a run', oppositeOutcome: 'Didn\'t go on a run' }
        ];

        $scope.changeToNewList = function(suggestion) {
          $scope.newList = suggestion;
        }

        function save() {
          $rootScope.$broadcast('saveListData');
        }

        $scope.createNewList = function(newList) {

          if(newList && newList.name && newList.desiredOutcome && newList.oppositeOutcome && newList.name.length && newList.desiredOutcome.length && newList.oppositeOutcome.length) {
            var toAdd = angular.copy(newList);
            toAdd.days = [];
            toAdd.startDate = new Date();
            toAdd.public = false;

            $scope.lists.push(toAdd);
            save();

            //$scope.newList.$setPristine();
            $scope.newList.name = '';
            $scope.newList.desiredOutcome = '';
            $scope.newList.oppositeOutcome = '';
          }

        };

      }
    };
  }]);
