'use strict';

angular.module('publicApp')
  .factory('REST', ['$http', function ($http) {
    return {
        getLists: function(callback) {
            $http.get('/lists')
                .then(function(res) {
                    callback(res);
                });
        },
        saveLists: function(lists, callback) {
            $http.post('/lists', {lists: lists})
                .then(function(res) {
                    callback && callback(res);
                });
        }
    };
  }]);
