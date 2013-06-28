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
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
      for(var i = 0; i < 7; ++i && d.setDate(d.getDate() + 1)) {
        $scope.lastWeek.push( { date: d.getDate(), timestamp : d.valueOf() } );
      }

      $scope.changeStatus = function(listObj, date) {
        var metric = _.findWhere($scope.lists, {name: listObj.name});
        var day = _.findWhere(metric.days, {dayTime: date.timestamp});
        var state = getClassColor(listObj, date);

        if(!state)
          metric.days.push({ dayTime: date.timestamp, good: true });
        else if(state == 'green')
          day.good = false;
        else {
          metric.days = _.reject(metric.days, function(day) {
            return day.dayTime == date.timestamp;
          });
        }

        save();
      }

      function getClassColor(listObj, date) {
        var day = _.findWhere(listObj.days, {dayTime: date.timestamp});
        return day ? day.good ? 'green' : 'red' : '';
      }

      $scope.getClass = function(listObj, date) {
        return 'box ' + getClassColor(listObj, date);
      }
  }]);
