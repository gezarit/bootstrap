describe("alert", function () {

  var scope, $compile;
  var element;

  beforeEach(module('ui.bootstrap.alert'));
  beforeEach(module('template/alert/alert.html'));

  beforeEach(inject(function ($rootScope, _$compile_, $controller) {

    scope = $rootScope;
    $compile = _$compile_;

    element = angular.element(
        "<div>" + 
          "<alert ng-repeat='alert in alerts' type='alert.type'" +
            "close='removeAlert($index)'>{{alert.msg}}" +
          "</alert>" +
        "</div>");

    scope.alerts = [
      { msg:'foo', type:'success'},
      { msg:'bar', type:'error'},
      { msg:'baz'}
    ];
  }));

  function createAlerts() {
    $compile(element)(scope);
    scope.$digest();
    return element.find('.alert');
  }

  function findCloseButton(index) {
    return element.find('.close').eq(index);
  }

  function hasCloseButton(index) {
    return findCloseButton(index).css('display') !== 'none';
  }

  it("should generate alerts using ng-repeat", function () {
    var alerts = createAlerts();
    expect(alerts.length).toEqual(3);
  });

  it("should use correct classes for different alert types", function () {
    var alerts = createAlerts();
    expect(alerts.eq(0)).toHaveClass('alert-success');
    expect(alerts.eq(1)).toHaveClass('alert-error');

    //defaults
    expect(alerts.eq(2)).toHaveClass('alert');
    expect(alerts.eq(2)).not.toHaveClass('alert-info');
    expect(alerts.eq(2)).not.toHaveClass('alert-block');
  });

  it("should fire callback when closed", function () {

    var alerts = createAlerts();

    scope.$apply(function () {
      scope.removeAlert = jasmine.createSpy();
    });

    findCloseButton(1).click();
    expect(scope.removeAlert).toHaveBeenCalledWith(1);
  });

  it('should not show close buttons if no close callback specified', function () {
    element = $compile('<alert>No close</alert>')(scope);
    scope.$digest();
    expect(hasCloseButton(0)).toBe(false);
  });

  it('it should be possible to add additional classes for alert', function () {
    var element = $compile('<alert class="alert-block" type="\'info\'">Default alert!</alert>')(scope);
    scope.$digest();
    expect(element).toHaveClass('alert-block');
    expect(element).toHaveClass('alert-info');
  });

  describe('closebale', function () {
    it('should not show close button if false even if `close` exists', function () {
      element = $compile('<alert closable="false" close="remove($index)"></alert>')(scope);
      scope.$digest();
      expect(hasCloseButton(0)).toBe(false);
    });

    it('should not show close button if true and `close` does not exist', function () {
      element = $compile('<alert closable="true"></alert>')(scope);
      scope.$digest();
      expect(hasCloseButton(0)).toBe(false);
    });

    describe('with dynamic alerts', function () {
      it('should show close button correctly if `close` exists', function () {
        scope.alerts = [
            {closable: true},
            {},
            {closable: false}
          ];

        element = angular.element(
          '<div>' +
            '<alert ng-repeat="alert in alerts" close="close()" closable="alert.closable">' +
            '</alert>' +
          '</div>');

          var alerts = createAlerts();
          expect(hasCloseButton(0)).toBe(true);
          expect(hasCloseButton(1)).toBe(true);
          expect(hasCloseButton(2)).toBe(false);
      });

      it('should not show close button if `close` does not exist', function () {
        scope.alerts = [
            {closable: true},
            {},
            {closable: false}
          ];

        element = angular.element(
          '<div>' +
            '<alert ng-repeat="alert in alerts" closable="alert.closable">' +
            '</alert>' +
          '</div>');

          var alerts = createAlerts();
          expect(hasCloseButton(0)).toBe(false);
          expect(hasCloseButton(1)).toBe(false);
          expect(hasCloseButton(2)).toBe(false);
      });
    });
  });

});
