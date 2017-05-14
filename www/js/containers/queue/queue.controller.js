angular.module('nexcast.queue.controllers', [])
  .controller('QueueCtrl', function($scope, $state, $ionicLoading, $timeout, $http, subscribeService, Player, queueService, $rootScope) {
    $scope.$watch(function() { return Player.hasInstance()}, function(newData, oldData) {
      $scope.hasInstance = newData;
    });


    refresh();
    $scope.pullToRefresh = function() {
      refresh(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    function refresh(cb) {
      $scope.myPodcasts = subscribeService.getAll();
      $scope.myQueueList = queueService.getAll();

      _.map($scope.myPodcasts, function(item, index) {
        $http.post(API_URL + 'getEpisodesByRss?rss='+item.rss).success(function(res) {

          _.map(res.result.episodes, function(episode) {
            var subcribeDate = new Date(item.date);
            var episodeDate = new Date(episode.pubDate);

            if(episodeDate > subcribeDate) {
              // ADD to queue
              if(!queueService.find(episode.media_location)) {
                var div = document.createElement("div");
                div.innerHTML = episode.description;
                var parsedDescription = div.textContent || div.innerText || "";

                /*var today = new Date();
                var dateDifference = (today - episodeDate) / (1000*60*60*24);

                var prettyDate = (dateDifference < 7) ? moment(episodeDate).format('dddd') : moment(episodeDate).format('MMM Do');
                */
                var prettyDate = _prettyDate(episodeDate);

                var prettyDuration = _prettyDuration(episode.duration);

                queueService.addToFront(getEpisode(episode, res.result));
                /*queueService.add({podcastTitle: res.result.title, imageUrl: res.result.imageurl, parsedDescription: parsedDescription, prettyDate: prettyDate,
                  media_location: episode.media_location, episodeTitle: episode.title, episodeDate: episodeDate, duration: episode.duration, prettyDuration: prettyDuration});*/
              }
            }
            if(index == ($scope.myPodcasts.length - 1) && cb) cb()
          });

          $scope.myQueueList = queueService.getAll();
          debugger;


        });
      });
    }

    $scope.listenTo = function(episode) {
      debugger;
      $rootScope.$broadcast('showPlayer', {episode: episode});
      // $state.current.data.episode = episode;
      // queueService.findAndMoveToTop(episode);
      // $state.go('player', {mp3: episode.media_location, key: episode.episode_key, title: episode.podcastTitle, subTitle: episode.episodeTitle });
    };
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      // Route: QUEUE
      if(toState.name == 'player' && fromState.name == 'app.tab.queue') {
        toState.data.episode = fromState.data.episode;
        debugger;
      }
    });

  });
