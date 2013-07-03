'use strict';

angular.module('publicApp', ['LocalStorageModule', 'ui.keypress'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/logInView.html',
        controller: 'LogInCtrl',
        public: true
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .when('/user/:userId', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/detailed', {
        templateUrl: 'views/detailed.html',
        controller: 'DetailedCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }]);
