angular.module('nexcast.discoverEnriched.controllers', [])
.controller('DiscoverEnrichedCtrl', function($scope, $state, $ionicLoading, $timeout, Player, DiscoverService, $localStorage, token, $rootScope ) {
  // $rootScope.discoverHistory.unshift($state.current.name);

  var DEFAULT_EMPTY = $localStorage.enrichedListTop10 || [{}, {}, {}, {}, {}, {}, {}];

  // So it initially renders something
  $scope.shows = DEFAULT_EMPTY;

  $scope.active = 'home_view';
  $scope.setActive = function(type) {
    console.log("Type: %o", type);
    $scope.active = type;

  };
  refresh();
  $scope.pullToRefresh = function() {
    refresh(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  function refresh (cb) {
    DiscoverService.getEnrichedShows().then(function(shows) {
      if(!shows) {
        if (cb) cb();
        return;
      }

      $scope.shows = $localStorage.enrichedListTop10 = shows.top10;
      $timeout(function() {
        $scope.shows = $scope.shows.concat(shows.top50);
      }, 500);
      $timeout(function() {
        $scope.shows = $scope.shows.concat(shows.top100);
      }, 1000);
      $timeout(function() {
        $scope.shows = $scope.shows.concat(shows.top150);
      }, 1500);
      $timeout(function() {
        $scope.shows = $scope.shows.concat(shows.top200);
      }, 2000);
      if (cb) cb();
    });
  }
  $scope.isActive = function(type) {
    return type === $scope.active;
  };

})