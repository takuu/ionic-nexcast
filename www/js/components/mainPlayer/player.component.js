angular.module("nexcast.player.component", [])
    .directive("nexcastPlayer", ['$rootScope', '$state','$stateParams', '$ionicLoading', 'Player', '$timeout',  function ($rootScope, $state,$stateParams, $ionicLoading, Player, $timeout) {
        return {
            restrict: "E",
            transclude: true,
            templateUrl: "js/components/mainPlayer/player.component.html",
            scope: {
              playerConfig : "=",
              tagPositionList: "="
            },
            link: function (scope, elements, attr) {
              var SEEK_DISPLACEMENT = 15;
              scope.playing = false;
              var mp3 = $stateParams.mp3;

              // $ionicLoading.show();
              var timer;
              scope.title = $stateParams.title;
              scope.subTitle = $stateParams.subTitle;
              Player.setTitle($stateParams.title || '');
              Player.setSubTitle($stateParams.subTitle || '');

              $rootScope.$on('playerSetup', function(event, data) {
                // debugger;
              });
              $rootScope.$on('playerStatus', function(event, data) {
                scope.playing = data.playing;
              });

              $rootScope.$on('showPlayer', function(event, data) {
                var episode = data.episode;

                scope.title = episode.podcastTitle || '';
                scope.subTitle = episode.episodeTitle || '';
                scope.duration = secondsToHms(Player.duration());
                scope.seekPosition = '0%';
              });

              $rootScope.$on('playerLoaded', function(event, data) {
                var episode = data.episode;

                // Do we need this?
                scope.title = episode.podcastTitle || '';
                scope.subTitle = episode.episodeTitle || '';
                scope.duration = secondsToHms(Player.duration());
                scope.seekPosition = '0%';
                // Do we need this --End

                scope.podcastLoaded = true;

                $rootScope.$apply();
              });

              scope.$watch('tagPositionList', function(newData, oldData) {
                if(Player.getInstance()) {
                  scope.tagPositions = _.map(newData || [], function(position) {
                    return ((parseInt(position)/Player.duration()) * 100) + '%';
                  });
                }
              });

              $rootScope.$on('playerPosition2', function(event, data) {
                var status = data.status;
                if(status == 2) {
                  scope.playing = true;
                } else {
                  scope.playing = false;
                }
                var position = data.position;
                updateSeek(position);
              });

              function updateSeek(position) {

                var duration = parseInt(Player.duration());
                scope.duration = secondsToHms(Player.duration());

                if (Player.getStatus() == 2) {
                  scope.playing = true;
                }

                // TODO: This is in here because duration isn't properly loaded on iOS.  Figure out
                // a good way to get duration once and call this once instead of over and over.
                scope.tagPositions = _.map(scope.tagPositionList, function(p) {
                  return ((parseInt(p)/Player.duration()) * 100) + '%';
                });

                scope.timeLeft = (duration && position) ? secondsToHms(duration - position): '';
                console.log('position vs duration', position, duration);
                scope.position = secondsToHMS(position);
                // scope.p = position;
                // scope.d = duration;

                scope.seekPosition = ((parseInt(position)/duration) * 100 * (1 - .03)) + '%';
              }

              scope.backSeek = function (x) {

                Player.getPosition().then(function(position) {
                  var newPos = parseInt(position) - (x || SEEK_DISPLACEMENT);
                  if (newPos < 0) newPos = 0;
                  Player.setPosition(newPos);
                  debugger;
                  updateSeek(newPos);
                });
              };

              scope.forwardSeek = function (x) {
                Player.getPosition().then(function(position) {
                  var newPos = parseInt(position) + (x || SEEK_DISPLACEMENT);
                  var duration = parseInt(Player.duration());
                  if(newPos > duration) newPos = duration;
                  Player.setPosition(newPos);
                  updateSeek(newPos);
                });
              };

              var rateIterate = 0;
              var RATE_LIST = [
                // { rate: .5, symbol: '½', img: 'img/icon_speed_1.5.png' },
                { rate: 1, symbol: '1', img: 'img/icon_speed_1.png' },
                { rate: 1.5, symbol: '1½', img: 'img/icon_speed_1.5.png' },
                { rate: 2, symbol: '2', img: 'img/icon_speed_2.png' }
              ];
              scope.currentRate = RATE_LIST[rateIterate];
              scope.increaseRate = function () {
                scope.currentRate = RATE_LIST[++rateIterate % RATE_LIST.length];
                Player.setRate(scope.currentRate.rate);
              };

              scope.play = function() {
                Player.play('main1');
                scope.playing = true;
              };


              scope.toggle = function () {
                if (scope.playing) {
                  scope.pause();
                } else {
                  scope.play();
                }
              };

              scope.getClass = function () {
                return !scope.playing ? 'ion-play' : 'ion-pause';
              };

              scope.pause = function() {
                Player.pause();
                scope.playing = false;
              };

              function secondsToHms(d) {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
                return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
              }

              scope.onRelease = function(event) {
                // debugger;
              };


              scope.onDrag = function(event) {
                var timelineWidth = window.innerWidth * (1-.04);
                var x = event.gesture.center.pageX - (window.innerWidth * .02);
                var percentage = (x/timelineWidth);

                var duration = parseInt(Player.duration());

                var currentPosition = percentage * duration;

                // Testing...
                Player.getPosition().then(function(pos) {
                  var displacement = .025 * duration;
                  if(currentPosition - pos > displacement) {

                    // scope.forwardSeek(currentPosition - pos);
                    Player.setPosition(percentage * duration);
                    updateSeek(percentage * duration);
                  }

                  if(pos - currentPosition > displacement) {

                    // scope.backSeek(pos - currentPosition);
                    Player.setPosition(percentage * duration);
                    updateSeek(percentage * duration);
                  }

                });

              };

            }
         }
    }]);
