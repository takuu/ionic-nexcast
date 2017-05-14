angular.module("nexcast.fullPlayer.component", [])
  .directive("nexcastPlayer", ['$rootScope', '$state','$stateParams', '$ionicLoading', 'Player', '$timeout', 'PlayList', function ($rootScope, $state,$stateParams, $ionicLoading, Player, $timeout, PlayList) {
    return {
      restrict: "E",
      transclude: true,
      templateUrl: "js/components/fullPlayer/fullPlayer.component.html",
      scope: {
      },
      link: function (scope, elements, attr) {
        $rootScope.$on('playEpisode', function(event, data) {
          var episode = data.episode;
          PlayList.playEpisode(episode);
        });
      }
    }
  }]);
