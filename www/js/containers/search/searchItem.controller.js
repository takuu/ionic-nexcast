angular.module('nexcast.searchItem.controllers', [])
  .controller('searchItemCtrl', function($scope, $state, $http, $ionicFilterBar, $stateParams, Player, subscribeService, queueService, $rootScope, hasTagsService, getEpisodesByRSSService, $q, $ionicHistory ) {

    $scope.isSubscribed = subscribeService.find($stateParams.rss);

    $scope.$watch(function() { return Player.hasInstance()}, function(newData, oldData) {
      $scope.hasInstance = newData;
    });
    $scope.search = [];
    $scope.episodeList = [];

    $scope.searchText = '';

    $scope.regex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';

    $scope.updated = function() {
      $scope.formUpdated = true;
    };

    $scope.goBack = function() {
      // $ionicHistory.goBack();
      $state.go('app.tab.search');
    };

    $scope.isLoading = true;

    if($stateParams.rss) {
      $scope.isRSS = true;
      getEpisodesByRSSService.getData($stateParams.rss).then(function(data) {
        console.log("Search result: %o", data);
        $scope.showResult = data;
        debugger;

        $scope.isLoading = false;

        $scope.search = [];
        $scope.searchText = '';
        hasTagsService.getTags($stateParams.rss).then(function(data) {
          var keyList = _.uniq(_.pluck(data, 'episode_key'));
          if(keyList.length) $scope.showHasTags = true;
          _.map($scope.showResult.episodes, function(episode) {
            var found = _.contains(keyList, episode.episode_key);
            episode.hasTags = found;
          });
        });
      });

    } else {
      $scope.isLoading = false;
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
        },
        debounce: false
      });
    };



    $scope.subscribe = function() {
      $scope.isSubscribed = true;
      var found = subscribeService.find($stateParams.rss);
      debugger;
      if(!found) {
        subscribeService.add($stateParams.rss, $scope.showResult.imageurl);
      }
    };

    $scope.subscribeToggle = function() {
      if($scope.isSubscribed) {
        $scope.unsubscribe();
      } else {
        $scope.subscribe();
      }
    }

    $scope.unsubscribe = function() {
      $scope.isSubscribed = false;
      subscribeService.remove($stateParams.rss)
    };

    $scope.fetchSearch = function(searchText) {
      $state.go('app.tab.search', {s: searchText});
    };

    $scope.listenTo = function(episode) {
      // var newEpisode = {podcastTitle: $scope.showResult.title, imageUrl: $scope.showResult.imageurl, parsedDescription: episode.parsedDescription,
      //   media_location: episode.media_location, episodeTitle: episode.title, episodeDate: new Date(episode.pubDate), duration: episode.duration};

      $rootScope.$broadcast('showPlayer', {episode: getEpisode(episode, $scope.showResult)});
      // queueService.addToFront(newEpisode);
      // console.log($state.current);
      // $state.current.data.episode = newEpisode;
      debugger;
      // $state.go('player', {mp3: episode.media_location, key: episode.episode_key, title: $scope.showResult.title, subTitle: episode.title })
    };

    $scope.fetchByUrl = function(a) {
      debugger;
      $state.go('app.tab.searchItem', {rss: a.rssUrl});
      /*$http.post('http://www.nexcast.co/api/v1/getEpisodesByRss?rss='+a.rssUrl).success(function(res) {
       console.log("Search result: %o", res);
       $scope.showResult = res.result;

       $scope.search = [];
       $scope.searchText = '';

       });*/
    }


    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      if(toState.name == 'player' && fromState.name == 'app.tab.search') {
        toState.data.episode = fromState.data.episode;
        debugger;
      }
    });



  })
