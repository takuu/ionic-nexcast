angular.module("nexcast.tags.component", [])
  .directive("nexcastTags", ['$rootScope', '$state', '$ionicLoading', '$interval', 'Player', '$location', '$sce', function ($rootScope, $state, $ionicLoading, $interval, Player, $location, $sce) {
    return {
      restrict: "E",
      transclude: true,
      templateUrl: "js/components/tags/tags.component.html",
      scope: {
        seekPosition: "<",
        tags: "<",
        listOrder: "<"
      },
      link: function (scope, elements, attr) {

        scope.currentImage = '';
        scope.currentText = '';

        $rootScope.$on('playerPosition2', function(event, data) {
          if(scope.tags && scope.tags.length) {

            var index = _.findLastIndex(scope.tags, function(tag) {
              return (data.position > tag.seconds);
            });

            var upcomingIndex = _.findLastIndex(scope.tags, function(tag) {
              return ((data.position + 10) > tag.seconds);
            });

            if(index >= 0) {
              scope.currentTagIndex = index;
              scope.currentTag = scope.tags[index] || {};
              var content = angular.element(document.querySelector('#formattedContent' + index));
              if (content[0]) content[0].innerHTML = scope.currentTag.formattedContent;
              // scope.currentTag.video_location = $sce.trustAsResourceUrl(scope.currentTag.youtube_location);
              // scope.currentTag.video_location = $sce.trustAsResourceUrl('https://www.youtube.com/embed/qVMW_1aZXRk');
            }
            if(upcomingIndex >= 0) {
              scope.incomingTagIndex = upcomingIndex;
            }

          }
        });

        $rootScope.$on('showPlayer', function(event, data) {
          scope.currentTagIndex = -1;
          scope.currentTag = {};
        });

        // $rootScope.$on('playerLoaded', function(event, data) {})

        scope.$watch('listOrder', function(newData, oldData) {
          switch(newData) {
            case 'reverse':
              scope.tagOrder = '-';
              break;
            case 'normal':
              scope.tagOrder = '+';
              break;
            default:
              break;
          }
        });

        scope.go = function(path) {
          window.open(path, '_blank', 'location=yes');
          // $location.path( path );
        };

        /*scope.toggle = function(index) {
          if(scope.currentToggledIndex == index) {
            // UnToggle
            scope.currentToggledIndex = -1;
          } else {
            scope.currentToggledIndex = index;
          }

        }*/

      }
    }
  }]);