angular.module('nexcast.taggedShows.controllers', [])
  .controller('DiscoverTaggedShowsCtrl', function($scope, $state, $ionicLoading, $timeout, Player, $localStorage, taggedShowsService, $rootScope, $interval, token) {
    var DEFAULT_EMPTY = [{}, {}, {}, {}, {}, {}, {}, {}];
    console.log('token: ', token);

    // So it initially renders something
    $scope.taggedShows = $localStorage.taggedShows || DEFAULT_EMPTY;



    refresh();
    $scope.pullToRefresh = function() {
      refresh(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    function refresh (cb) {
      taggedShowsService.getData().then(function (data) {
        if (!data) {
          if (cb) cb();
          return;
        }
        $scope.taggedShows = $localStorage.taggedShows = data;
        if (cb) cb();
      });
    }

    // if($rootScope.discoverHistory) $rootScope.discoverHistory.unshift($state.current.name);
  })