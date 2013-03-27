/*
 * dropdownToggle - Provides dropdown menu functionality in place of bootstrap js
 */

angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle',
['$document', '$location', function ($document, $location) {

  var openScope = null;

  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      heading: '@',
      placement: '@',
      onToggle: '&'
    },
    templateUrl: 'template/dropdownToggle/dropdownToggle.html',
    replace: true,
    link: function(scope, element, attrs) {
      var initiallyOpen = (angular.isDefined(attrs.opened)) ? scope.$eval(attrs.opened) : false;

      scope.isOpen = function() {
        return ( scope.open === true );
      };

      scope.toggleClose = function(isDocumentClick) {
        scope.open = false;
        $document.unbind('click', scope.toggleClose);
        openScope = null;

        if ( isDocumentClick !== false ) {
          scope.$apply();
        }
      };

      scope.toggleOpen = function() {
        scope.open = true;
        $document.bind('click', scope.toggleClose);

        if ( openScope ) {
          openScope.toggleClose(false);
        }
        openScope = scope;
      };

      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        // Check if i was open
        if ( scope.isOpen() ) {
          scope.toggleClose(false);
        } else {
          scope.toggleOpen();
        }
        scope.$apply();

        scope.onToggle({ open: scope.isOpen() });
      });

      scope.$watch(function dropdownTogglePathWatch() {
        return $location.path();
      }, function dropdownTogglePathWatchAction(newPath, oldPath) {
        if ( newPath !== oldPath && scope.isOpen() ) {
          scope.toggleClose(false);
        }
      });

      if ( initiallyOpen ) {
        scope.toggleOpen();
      }
    }
  };
}]);
