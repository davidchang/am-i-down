'use strict';

describe('Directive: listObj', function () {
  beforeEach(module('publicApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<list-obj></list-obj>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the listObj directive');
  }));
});
