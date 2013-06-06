'use strict';

describe('Directive: newMetricForm', function () {
  beforeEach(module('publicApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<new-metric-form></new-metric-form>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the newMetricForm directive');
  }));
});
