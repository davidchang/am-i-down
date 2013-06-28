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

      function save() {
        console.log('saving');
        console.log($scope.lists);

        REST.saveLists($scope.lists);
      }

      $scope.$on('saveListData', function() {
        save();
      });
      
      $scope.lastWeek = [];
      var d = new Date();
      d.setDate(d.getDate() - 7);
      for(var i = 0; i < 7; ++i && d.setDate(d.getDate() + 1)) {
        $scope.lastWeek.push( d.getDate() );
      }

      $scope.changeStatus = function(listObj, index) {
        console.log(listObj);
        console.log(index);
      }
  }]);
