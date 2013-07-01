'use strict';

angular.module('publicApp')
  .factory('Auth', ['$http', '$q', function ($http, $q) {
    return {
        isLoggedIn: function() {
            var deferred = $q.defer();

            $http.get('/user')
                .then(function(res) {
                    console.log('from AUTH service');
                    console.log(res);
                    deferred.resolve(res.data);
                });

            return deferred.promise;
        }
    };
  }]);
