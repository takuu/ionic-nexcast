angular.module('nexcast.category.controllers', [])
.controller('DiscoverCategoryCtrl', function($scope, $state, $ionicLoading, $timeout, $stateParams, DiscoverService) {
  var DEFAULT_EMPTY = [{}, {}, {}, {}, {},{}];
  $scope.selected_category = $stateParams.cid;


  $scope.category = DEFAULT_EMPTY;
  refresh();
  $scope.pullToRefresh = function() {
    refresh(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  function refresh (cb) {
    DiscoverService.getCategory(encodeURIComponent($stateParams.cid)).then(function(category) {
      if (!category) {
        if (cb) cb();
        return;
      }
      $scope.fetchedData = true;
      $scope.category = category;
      if (cb) cb();
    });
  }

});