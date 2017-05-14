angular.module("nexcast.miniPlayer.component", [])
  .directive("nexcastMiniPlayer", ['$rootScope', '$state', '$ionicLoading', '$interval', 'Player', function ($rootScope, $state, $ionicLoading, $interval, Player) {
    return {
      restrict: "E",
      transclude: true,
      templateUrl: "js/components/miniPlayer/miniPlayer.html",
      scope: {
        playerConfig: "<"
      },
      link: function (scope, elements, attr) {
        scope.title = Player.getTitle();
        scope.subTitle = Player.getSubTitle();

        scope.listenTo = function() {
          console.log($rootScope.openModal);
          debugger;
          $rootScope.openModal();
        }

        scope.toggle = function () {
          if (scope.playing) {
            scope.pause();
          } else {
            scope.play();
          }
        };

        scope.play = function() {
          Player.play('mini');
          scope.playing = true;
        };

        scope.pause = function() {
          Player.pause();
          scope.playing = false;
        };

        $rootScope.$on('playerLoaded', function(event, data) {
          // {episode: next, continuePlaying: true}
          scope.title = Player.getTitle();
          scope.subTitle = Player.getSubTitle();
        });

        $rootScope.$on('playerStatus', function(event, data) {
          scope.playing = data.playing;
        });

        $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
          var status = Player.getStatus();
          if(status == 2) {
            scope.playing = true;
          } else if (status == 3) {
            scope.playing = false;
          }
          debugger;
        })


      }
    }
  }]);
