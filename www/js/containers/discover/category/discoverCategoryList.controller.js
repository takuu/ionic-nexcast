angular.module('nexcast.categoryList.controllers', [])
.controller('DiscoverCategoryListCtrl', function($scope, $state, $ionicLoading, $timeout, Player, $localStorage, DiscoverService, $rootScope) {
  var DEFAULT_EMPTY = [{}, {}, {}, {}, {}, {}, {}, {}];

  // So it initially renders something
  $scope.categories = $localStorage.categoryList || DEFAULT_EMPTY;
  DiscoverService.getCategories().then(function(categories) {
    if (!categories) return;
    $scope.categories = $localStorage.categoryList = categories;
  });
  // $rootScope.discoverHistory.unshift($state.current.name);
})