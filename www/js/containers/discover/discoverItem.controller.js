angular.module('nexcast.discoverItem.controllers', [])
    .controller('DiscoverItemCtrl', function($scope, $state, $ionicLoading, $timeout, Player, subscribeService, $stateParams, $http, queueService, $rootScope, hasTagsService, getEpisodesByRSSService, $ionicHistory) {

        $scope.isLoading = true;
        $scope.title = 'Podcasts';
        if($stateParams.rss) {
            $scope.isSubscribed = subscribeService.find($stateParams.rss);
            debugger;
            $scope.isRSS = true;

            getEpisodesByRSSService.getData($stateParams.rss).then(function(data) {
                console.log("Search result: %o", data);
                $scope.showResult = data;
                debugger;
                $scope.isLoading = false;
                $scope.title = $scope.showResult.title;

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
        $scope.$watch(function() { return Player.hasInstance()}, function(newData, oldData) {
            $scope.hasInstance = newData;
        });
        $scope.myPodcasts = subscribeService.getAll();

        $scope.goBack = function() {
          $state.go($rootScope.discoverHistory[0]);
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
        };

        $scope.listenTo = function(episode) {
            queueService.addToFront(getEpisode(episode, $scope.showResult));
            /*queueService.addToFront({podcastTitle: $scope.showResult.title, imageUrl: $scope.showResult.imageurl, parsedDescription: episode.parsedDescription,
             media_location: episode.media_location, episodeTitle: episode.title, episodeDate: new Date(episode.pubDate), duration: episode.duration});*/
            $rootScope.$broadcast('showPlayer', {episode: getEpisode(episode, $scope.showResult)});
            // $state.go('player', {mp3: episode.media_location, key: episode.episode_key, title: $scope.showResult.title, subTitle: episode.title })
        };


        $scope.unsubscribe = function() {
            $scope.isSubscribed = false;
            subscribeService.remove($stateParams.rss)
        };
    });