'use strict';

describe('Directive: siteheader', function () {
  beforeEach(module('publicApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<siteheader></siteheader>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the siteheader directive');
  }));
});
