angular.module('nexcast.profile.controllers', [])
  .controller('ProfileCtrl', function($scope, $state, $ionicLoading, $timeout, Player) {
    $scope.$watch(function() { return Player.hasInstance()}, function(newData, oldData) {
      $scope.hasInstance = newData;
    });

    $scope.feedback = function () {
      debugger;
      if (!cordova) return;
      cordova.plugins.email.isAvailable(
        function (isAvailable) {
          if(isAvailable) {
            cordova.plugins.email.open({
              to:      'hi@nexcast.co',
              subject: 'Greetings',
              body:    ''
            });
          } else {
            alert('Service is not available unless email is registered');
          }

        }
      );
    }
  });