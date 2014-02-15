angular.module('ui.bootstrap.dropdown', [])

.constant('dropdownConfig', {
  openClass: 'open'
})

.service('dropdownService', ['$document', function($document) {
  var self = this, openScope = null;

  this.open = function( dropdownScope ) {
    if ( !openScope ) {
      $document.bind('click', closeDropdown);
      $document.bind('keydown', keydownBind);
    }

    if ( openScope && openScope !== dropdownScope ) {
        openScope.isOpen = false;
    }

    openScope = dropdownScope;
    openScope.focusIndex = -1;
  };

  this.close = function( dropdownScope ) {
    if ( openScope === dropdownScope ) {
      openScope = null;
      $document.unbind('click', closeDropdown);
      $document.unbind('keydown', keydownBind);
    }
  };

  var closeDropdown = function() {
    openScope.$apply(function() {
      openScope.isOpen = false;
    });
  };

  var keydownBind = function( evt ) {
    if (/(38|40|27)/.test(evt.which)) {
      evt.preventDefault();
      evt.stopPropagation();

      if ( evt.which === 27 ) {
        closeDropdown();
      } else if ( openScope.items.length > 0 ) {
        if (evt.which === 38 && openScope.focusIndex > 0) {
          openScope.focusIndex--;   // up
        } else if (evt.which === 40 && openScope.focusIndex < openScope.items.length - 1) {
          openScope.focusIndex++;   // down
        }
        openScope.items[openScope.focusIndex].focus();
      }
    }
  };
}])

.controller('DropdownController', ['$scope', '$attrs', 'dropdownConfig', 'dropdownService', '$animate', function($scope, $attrs, dropdownConfig, dropdownService, $animate) {
  var self = this, openClass = dropdownConfig.openClass;

  this.init = function( element ) {
    $scope.element = element;
    $scope.items = this.getItems(element);
    $scope.isOpen = angular.isDefined($attrs.isOpen) ? $scope.$parent.$eval($attrs.isOpen) : false;
  };

  this.toggle = function( open ) {
    return $scope.isOpen = arguments.length ? !!open : !$scope.isOpen;
  };

  // Allow other directives to watch status
  this.isOpen = function() {
    return $scope.isOpen;
  };

  this.getItems = function( element ) {
    return element[0].querySelectorAll('.dropdown-menu > li a');
  };

  $scope.$watch('isOpen', function( value ) {
    $animate[value ? 'addClass' : 'removeClass']($scope.element, openClass);

    if ( value ) {
      dropdownService.open( $scope );
    } else {
      dropdownService.close( $scope );
    }

    $scope.onToggle({ open: !!value });
  });

  $scope.$on('$locationChangeSuccess', function() {
    $scope.isOpen = false;
  });
}])

.directive('dropdown', function() {
  return {
    restrict: 'CA',
    controller: 'DropdownController',
    scope: {
      isOpen: '=?',
      onToggle: '&'
    },
    link: function(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init( element );
    }
  };
})

.directive('dropdownToggle', function() {
  return {
    restrict: 'CA',
    require: '?^dropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if ( !dropdownCtrl ) {
        return;
      }

      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if ( !element.hasClass('disabled') && !element.prop('disabled') ) {
          scope.$apply(function() {
            dropdownCtrl.toggle();
          });
        }
      });

      // WAI-ARIA
      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
      scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
        element.attr('aria-expanded', !!isOpen);
      });
    }
  };
});
