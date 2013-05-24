'use strict';

describe('Controller: LogInControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('publicApp'));

  var LogInControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LogInControllerCtrl = $controller('LogInControllerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
