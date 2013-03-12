angular.module('ui.bootstrap.pagination', [])

.constant('paginationConfig', {
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  groupedMaxMode: false,
  ellipsisText: '...'
})

.directive('pagination', ['paginationConfig', function(paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      numPages: '=',
      currentPage: '=',
      maxSize: '=',
      onSelectPage: '&'
    },
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs) {

      // Setup configuration parameters
      var boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      var directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$eval(attrs.directionLinks) : paginationConfig.directionLinks;
      var firstText = angular.isDefined(attrs.firstText) ? attrs.firstText : paginationConfig.firstText;
      var previousText = angular.isDefined(attrs.previousText) ? attrs.previousText : paginationConfig.previousText;
      var nextText = angular.isDefined(attrs.nextText) ? attrs.nextText : paginationConfig.nextText;
      var lastText = angular.isDefined(attrs.lastText) ? attrs.lastText : paginationConfig.lastText;
      var groupedMaxMode = angular.isDefined(attrs.groupedMaxMode) ? scope.$eval(attrs.groupedMaxMode) : paginationConfig.groupedMaxMode;
      var ellipsisText = angular.isDefined(attrs.ellipsisText) ? attrs.ellipsisText : paginationConfig.ellipsisText;

      // Create page object used in template
      function makePage(number, text, isActive, isDisabled) {
        return {
          number: number,
          text: text,
          active: isActive,
          disabled: isDisabled
        };
      }

      // Compute start & last page based on maxMode
      function getMaxLimits(current, size, numPages) {
        var start;

        if ( groupedMaxMode ) {
          // Visible pages are paginated with maxSize
          start = ((Math.ceil(current / size) - 1) * size) + 1;

          // Adjust maxSize if limit is exceeded
          if ((start + size - 1) > numPages) {
            size = numPages - start + 1;
          }
        } else {
          // Current page is displayed in the middle of the visible ones
          start = current - Math.floor(size/2);

          //adjust the startPage within boundary
          if(start < 1) {
              start = 1;
          }
          // Adjust start page if limit is exceeded
          if ((start + size - 1) > numPages) {
              start = numPages - size + 1;
          }
        }

        return {
          start: start,
          size: size
        };
      }

      scope.$watch('numPages + currentPage + maxSize', function() {
        scope.pages = [];
        
        //set the default maxSize to numPages
        var maxSize, startPage;

        if ( scope.maxSize && scope.maxSize < scope.numPages ) {
          var limits = getMaxLimits(scope.currentPage, scope.maxSize, scope.numPages);

          maxSize = limits.size;
          startPage = limits.start;
        } else {
          // Display all pages
          maxSize = scope.numPages;
          startPage = 1;
        }

        // Add page number links
        var maxPage = startPage + maxSize;
        for (var number = startPage; number < maxPage; number++) {
          scope.pages.push(makePage(number, number, scope.isActive(number), false));
        }

        // Add ellipsis links
        if ( groupedMaxMode ) {
          if (startPage > 1) {
            scope.pages.unshift(makePage(startPage - 1, ellipsisText, false, false));
          }
          if (maxPage < scope.numPages) {
            scope.pages.push(makePage(maxPage, ellipsisText, false, false));
          }
        }

        // Add previous & next links
        if (directionLinks) {
          scope.pages.unshift(makePage(scope.currentPage - 1, previousText, false, scope.noPrevious()));
          scope.pages.push(makePage(scope.currentPage + 1, nextText, false, scope.noNext()));
        }

        // Add first & last links
        if (boundaryLinks) {
          scope.pages.unshift(makePage(1, firstText, false, scope.noPrevious()));
          scope.pages.push(makePage(scope.numPages, lastText, false, scope.noNext()));
        }


        if ( scope.currentPage > scope.numPages ) {
          scope.selectPage(scope.numPages);
        }
      });
      scope.noPrevious = function() {
        return scope.currentPage === 1;
      };
      scope.noNext = function() {
        return scope.currentPage === scope.numPages;
      };
      scope.isActive = function(page) {
        return scope.currentPage === page;
      };

      scope.selectPage = function(page) {
        if ( ! scope.isActive(page) && page > 0 && page <= scope.numPages) {
          scope.currentPage = page;
          scope.onSelectPage({ page: page });
        }
      };
    }
  };
}]);