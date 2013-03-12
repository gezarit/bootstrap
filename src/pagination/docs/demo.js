var PaginationDemoCtrl = function ($scope) {
  $scope.noOfPages = 7;
  $scope.currentPage = 4;
  $scope.maxSize = 5;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.bigNoOfPages = 53;
  $scope.bigCurrentPage = 17;
};
