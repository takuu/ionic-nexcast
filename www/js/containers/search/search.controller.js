angular.module('nexcast.search.controllers', [])
  .controller('searchCtrl', function($scope, $state, $http, $ionicFilterBar, $stateParams, Player, subscribeService, queueService, $rootScope, hasTagsService, getEpisodesByRSSService, $q, $ionicHistory, $timeout ) {

    $scope.isSubscribed = subscribeService.find($stateParams.s);

    $scope.$watch(function() { return Player.hasInstance()}, function(newData, oldData) {
      $scope.hasInstance = newData;
    });

    $scope.showFilterBar = function () {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "<i class='ion-ios-close-outline'></i>",
        items: $scope.search,
        update: function (filteredItems, filterText) {
          if (filterText) {
            $scope.fetchSearch(filterText);
          }
          $scope.search = filteredItems;
        },
        delay: 400
      });
    };
    if($state.current && $state.current.data.shows.length) {
      $scope.search = ($state.current && $state.current.data.shows) || [];
    } else {
      $timeout(function() {
        $scope.showFilterBar();
      }, 300);

    }

    $scope.episodeList = [];

    $scope.searchText = '';

    $scope.regex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';

    $scope.updated = function() {
      $scope.formUpdated = true;
    };

    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    $scope.isLoading = true;

    if($stateParams.s) {
      $http.get(API_URL + 'search/' + $stateParams.s).success(function(res) {
        console.log("Search result: %o", res);
        $scope.isLoading = false;
        $scope.search = res.result;

        $scope.showResult = [];
      });
    }

    $scope.isLoading = false;



    $scope.fetchSearch = function(searchText) {
      $http.get(API_URL + 'search/'+searchText).success(function(res) {
        console.log("Search result: %o", res);
        $scope.isLoading = false;
        $scope.search = res.result;

        $scope.showResult = [];
      });
    };


    $scope.fetchByUrl = function(a) {
      $state.go('app.tab.search.item', {rss: a.rssUrl});
      /*$http.post('http://www.nexcast.co/api/v1/getEpisodesByRss?rss='+a.rssUrl).success(function(res) {
       console.log("Search result: %o", res);
       $scope.showResult = res.result;

       $scope.search = [];
       $scope.searchText = '';

       });*/
    };


    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
      if(toState.name == 'app.tab.search' && fromState.name != 'app.tab.search' && fromState.name != 'app.tab.searchItem') {
        debugger;
        $timeout(function() {
          $scope.showFilterBar();
        }, 300);
      }

      // Search Detail => Search List
      if(fromState.name == 'app.tab.searchItem' && toState.name == 'app.tab.search') {
        debugger;
        $scope.search = fromState.data.shows
      }

      // Search List => Search Detail
      if(fromState.name == 'app.tab.search' && toState.name == 'app.tab.searchItem') {
        debugger;
        toState.data.shows = $scope.search;
      }
    });




  })
