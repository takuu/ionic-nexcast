angular.module('nexcast.discover.controllers', [])
  .controller('DiscoverCtrl', function($scope, $state, $ionicLoading, $timeout, Player ) {
    $scope.$watch(function() { return Player.getInstance()}, function(newData, oldData) {
      $scope.hasInstance = !!newData;
    });

    debugger;
  });