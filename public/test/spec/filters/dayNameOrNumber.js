'use strict';

describe('Filter: dayNameOrNumber', function () {

  // load the filter's module
  beforeEach(module('publicApp'));

  // initialize a new instance of the filter before each test
  var dayNameOrNumber;
  beforeEach(inject(function ($filter) {
    dayNameOrNumber = $filter('dayNameOrNumber');
  }));

  it('should return the input prefixed with "dayNameOrNumber filter:"', function () {
    var text = 'angularjs';
    expect(dayNameOrNumber(text)).toBe('dayNameOrNumber filter: ' + text);
  });

});
