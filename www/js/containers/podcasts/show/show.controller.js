angular.module('nexcast.mypodcastsShow.controllers', [])
  .controller('PodcastShowCtrl', function($scope, $state, $ionicLoading, $timeout, Player, subscribeService) {
    $scope.$watch(function() { return Player.hasInstance()}, function(newData, oldData) {
      $scope.hasInstance = newData;
    });
    $scope.myPodcasts = subscribeService.getAll();
    debugger;
  });