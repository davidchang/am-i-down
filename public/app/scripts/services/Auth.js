'use strict';

angular.module('publicApp')
  .factory('Auth', ['$http', '$q', function ($http, $q) {
    return {
        isLoggedIn: function() {
            var deferred = $q.defer();

            $http.get('/user')
                .then(function(res) {
                    console.log(res.data);
                    deferred.resolve(res.data);
                });

            return deferred.promise;
        }
    };
  }]);
