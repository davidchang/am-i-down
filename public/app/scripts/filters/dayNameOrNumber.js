'use strict';

angular.module('publicApp')
  .filter('dayNameOrNumber', function () {
    return function (day, useDayNumber) {
      return useDayNumber ? day.date : day.name;
    };
  });
