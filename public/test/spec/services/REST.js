'use strict';

describe('Service: REST', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var REST;
  beforeEach(inject(function (_REST_) {
    REST = _REST_;
  }));

  it('should do something', function () {
    expect(!!REST).toBe(true);
  });

});
