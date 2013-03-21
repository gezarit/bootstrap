angular.module('ui.bootstrap.pagination', [])

.constant('paginationConfig', {
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true, // Whether to keep current page in the middle of visible ones
  ellipsisText: '...',
  showSingle: true
})

.controller('PaginationController', ['$scope', '$attrs', function ($scope, $attrs) {

  var self = this;

  this.build = function(type, config) {
    $scope.options = getOptions(config);

    switch (type) {
      case 'pagination':
        $scope.$watch('numPages + currentPage + maxSize', function() {
          $scope.pages = [];

          addNumberLinks();
          addEllipsisLinks();
          addDirectionLinks();
          addBoundaryLinks();

          limitCurrentPage();
        });
        break;

      case 'pager':
        $scope.$watch('numPages + currentPage', function() {
          limitCurrentPage();
        });
        break;

      default:
        throw new Error('Unknown pagination type.');
    }
  };

  // Adjust current page within boundary
  function limitCurrentPage() {
    if ( $scope.currentPage > $scope.numPages ) {
      $scope.selectPage($scope.numPages);
    }
  }

  // Get configuration parameters from attributes & global config
  function getOptions(config) {
    var options = {};
    angular.forEach(config, function(value, key) {
      if (angular.isDefined($attrs[key])) {
        options[key] = (angular.isString(value)) ? $attrs[key] : $scope.$eval($attrs[key]);
      } else {
        options[key] = value;
      }
    });
    return options;
  }

  // Create page object used in template
  function makePage(number, text, isActive, isDisabled) {
    return {
      number: number,
      text: text,
      active: isActive,
      disabled: isDisabled
    };
  }

  // Add page number links
  function addNumberLinks() {
    angular.extend(self, getPageNumberLimits());

    for (var number = self.startNumber; number <= self.lastNumber; number++) {
      $scope.pages.push(makePage(number, number, $scope.isActive(number), false));
    }
  }

  // Add previous & next links
  function addDirectionLinks() {
    if ( $scope.options.directionLinks ) {
      var previousPage = makePage($scope.currentPage - 1, $scope.options.previousText, false, $scope.noPrevious());
      $scope.pages.unshift(previousPage);

      var nextPage = makePage($scope.currentPage + 1, $scope.options.nextText, false, $scope.noNext());
      $scope.pages.push(nextPage);
    }
  }

  // Add first & last links
  function addBoundaryLinks() {
    if ( $scope.options.boundaryLinks ) {
      var firstPage = makePage(1, $scope.options.firstText, false, $scope.noPrevious());
      $scope.pages.unshift(firstPage);

      var lastPage = makePage($scope.numPages, $scope.options.lastText, false, $scope.noNext());
      $scope.pages.push(lastPage);
    }
  }

  // Add ellipsis link to move to next page set
  function addEllipsisLinks() {
    if ( ! $scope.options.rotate ) {
      if (self.startNumber > 1) {
        var previousEllipsis = makePage(self.startNumber - 1, $scope.options.ellipsisText, false, false);
        $scope.pages.unshift(previousEllipsis);
      }

      if (self.lastNumber < $scope.numPages - 1) {
        var nextEllipsis = makePage(self.lastNumber + 1, $scope.options.ellipsisText, false, false);
        $scope.pages.push(nextEllipsis);
      }
    }
  }

  // Compute start & last visible page numbers
  function getPageNumberLimits() {
    var startNumber, lastNumber;

    if ( $scope.maxSize && $scope.maxSize < $scope.numPages ) { 
      if ( $scope.options.rotate ) {
        // Current page is displayed in the middle of the visible ones
        startNumber = $scope.currentPage - Math.floor( $scope.maxSize / 2 );

        //adjust the startPage within boundary
        if(startNumber < 1) {
            startNumber = 1;
        }

        lastNumber = startNumber + $scope.maxSize - 1;

        // Adjust start page if limit is exceeded
        if (lastNumber > $scope.numPages) {
            startNumber = $scope.numPages - $scope.maxSize + 1;
            lastNumber = $scope.numPages;
        }
      } else {
        // Visible pages are paginated with maxSize
        startNumber = ((Math.ceil($scope.currentPage / $scope.maxSize) - 1) * $scope.maxSize) + 1;

        // Adjust last page if limit is exceeded
        lastNumber = Math.min(startNumber + $scope.maxSize - 1, $scope.numPages);
      }
    } else {
      // Display all pages
      startNumber = 1;
      lastNumber  = $scope.numPages;
    }

    return { startNumber: startNumber, lastNumber: lastNumber };
  }

  $scope.noPrevious = function() {
    return $scope.currentPage === 1;
  };
  $scope.noNext = function() {
    return $scope.currentPage === $scope.numPages;
  };

  $scope.isActive = function(page) {
    return $scope.currentPage === page;
  };

  // Called from template
  $scope.selectPage = function(page) {
    if ( ! $scope.isActive(page) && page > 0 && page <= $scope.numPages) {
      $scope.currentPage = page;
      $scope.onSelectPage({ page: page });
    }
  };

  // Whether to display pagination list on single page
  $scope.show = function() {
    return ( $scope.numPages > 1 || $scope.options.showSingle );
  };

}])

.directive('pagination', ['paginationConfig', function(paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      numPages: '=',
      currentPage: '=',
      maxSize: '=',
      onSelectPage: '&'
    },
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs, paginationCtrl) {
      paginationCtrl.build('pagination', paginationConfig);
    }
  };
}])

.constant('pagerConfig', {
  previousText: 'Previous',
  nextText: 'Next',
  align: false,
  showSingle: false
})

.directive('pager', ['pagerConfig', function(pagerConfig) {
  return {
    restrict: 'EA',
    scope: {
      numPages: '=',
      currentPage: '=',
      onSelectPage: '&'
    },
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pager.html',
    replace: true,
    link: function(scope, element, attrs, paginationCtrl) {
      paginationCtrl.build('pager', pagerConfig);
    }
  };
}]);