angular.module("ui.bootstrap.alert", []).directive('alert', function () {
  return {
    restrict:'EA',
    templateUrl:'template/alert/alert.html',
    transclude:true,
    replace:true,
    scope: {
      type: '=',
      close: '&'
    },
    link: function(scope, element, attrs) {
      scope.closable = "close" in attrs && (angular.isUndefined(attrs.closable) || scope.$parent.$eval(attrs.closable) !== false);
    }
  };
});
