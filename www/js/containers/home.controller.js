angular.module('nexcast.home.controllers', [])

.controller('HomeCtrl', function($scope, $state, $ionicLoading, $timeout) { })
.controller('AuthCtrl', function($scope, $state, $ionicLoading, $timeout) { })
.controller('SearchCtrl', function($scope, $state, $ionicLoading, $timeout) { })

/*.controller('PodcastsCtrl', function($scope, $state, $ionicLoading, $timeout, Player, subscribeService) {
  $scope.$watch(function() { return Player.getInstance()}, function(newData, oldData) {
    $scope.hasInstance = !!newData;
  });
  $scope.myPodcasts = subscribeService.getAll();
})*/
/*  .controller('DiscoverCtrl', function($scope, $state, $ionicLoading, $timeout, Player ) {
    $scope.$watch(function() { return Player.getInstance()}, function(newData, oldData) {
      $scope.hasInstance = !!newData;
    });
  })*/


/*.controller('DiscoverHomeCtrl', function($scope, $state, $ionicLoading, $timeout, Player, DiscoverService ) {

  // So it initially renders something
  $scope.shows = [{}, {}, {}, {}, {}];
  DiscoverService.getEnrichedShows().then(function(shows) {

    $scope.shows = shows.top10;
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
  });

  $scope.active = 'home_view';
  $scope.setActive = function(type) {
    console.log("Type: %o", type);
    $scope.active = type;

  };
  $scope.isActive = function(type) {
    return type === $scope.active;
  };

  //$scope.categories = ca;
})*/
/*.controller('DiscoverCategoriesCtrl', function($scope, $state, $ionicLoading, $timeout, Player, DiscoverService) {

  // So it initially renders something
  $scope.categories = [{}, {}, {}, {}, {}, {}, {}, {}];
  DiscoverService.getCategories().then(function(categories) {
    $scope.categories = categories;
  });
})
.controller('DiscoverCategoryCtrl', function($scope, $state, $ionicLoading, $timeout, $stateParams, category, Player) {
  $scope.selected_category = $stateParams.cid;
  $scope.category = category;
});*/

//--------------------------
// Search
//--------------------------
/*.controller('searchCtrl', function($scope, $state, $ionicLoading, $http, $ionicFilterBar, $stateParams  ) {

  debugger;

  $scope.search = [];
  $scope.episodeList = [];

  $scope.searchText = '';

  if($stateParams.rss) {
    $scope.isRSS = true;
    $http.post('http://www.nexcast.co/api/v1/getEpisodesByRss?rss='+$stateParams.rss).success(function(res) {
      console.log("Search result: %o", res);
      $scope.showResult = res.result;

      _.map($scope.showResult.episodes, function(episode) {
        var div = document.createElement("div");
        div.innerHTML = episode.description;
        var text = div.textContent || div.innerText || "";
        episode.parsedDescription = text;
      })
      debugger;
      $scope.search = [];
      $scope.searchText = '';

    });
  }

  $scope.showFilterBar = function () {
    var filterBarInstance = $ionicFilterBar.show({
      cancelText: "<i class='ion-ios-close-outline'></i>",
      items: $scope.search,
      update: function (filteredItems, filterText) {
        if (filterText) {
          $scope.fetchSearch(filterText);
        }
        $scope.search = filteredItems;
      }
    });
  };

  $scope.fetchSearch = function(searchText) {
      $http.get('http://www.nexcast.co/api/v1/search?keyword='+searchText).success(function(res) {
        console.log("Search result: %o", res);
        $scope.search = res.result;

        $scope.showResult = [];
      });
  }

  $scope.fetchByUrl = function(a) {

    $state.go('app.tab.search', {rss: a.rssUrl});
    /!*$http.post('http://www.nexcast.co/api/v1/getEpisodesByRss?rss='+a.rssUrl).success(function(res) {
      console.log("Search result: %o", res);
      $scope.showResult = res.result;

      $scope.search = [];
      $scope.searchText = '';

    });*!/
  }



})*/
