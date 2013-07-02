'use strict';

angular.module('publicApp')
  .factory('REST', ['$http', function ($http) {
    return {
        getLists: function(callback) {
          $http.get('/lists')
            .then(function(res) {
              callback && callback(res);
            });
        },
        saveLists: function(lists, callback) {
          $http.post('/lists', {lists: lists})
            .then(function(res) {
              callback && callback(res);
            });
        },
        acceptOrRejectInvitation: function(accepted, callback) {
          $http.post('/invitation', {accepted: accepted})
            .then(function(res) {
              callback && callback(res);
            });
        },
        getOwnInviteLink: function(callback) {
          $http.get('/user/inviteLink')
            .then(function(res) {
              callback && callback(res);
            });
        },
        getAccountabilityPartners: function(callback) {
          $http.get('/user/accountabilityPartners')
            .then(function(res) {
              callback && callback(res);
            });
        }
    };
  }]);
