angular.module('nexcast.player.controllers', [])
  .controller('PlayerMainCtrl', function($scope, $rootScope, $state, $ionicLoading, $interval,tags, Player, $ionicModal, $stateParams, queueService, PlayList) {

    $scope.currentPosition = 0;
    $scope.tags = _.pluck(tags, 'seconds');

    $scope.title = $stateParams.title;
    $scope.subTitle = $stateParams.subTitle;

    $scope.playerConfig = {};

    $rootScope.$on('playerSetup', function(event, data) {

      // debugger;
    });

    var episode = $state.current.data.episode;
    PlayList.playEpisode(episode);

    // PlayList.playFromTop();

    $rootScope.$on('playerPosition2', function(event, data) {
      console.log('playerPosition2!: ', data);
      $scope.currentPosition = data && data.position;
    });

    $ionicModal.fromTemplateUrl('templates/partials/player-options.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });


    $scope.back = function () {
      window.history.back();
    };

    $scope.showSummary = function() {
      debugger;
      $scope.listOrder = 'reverse';
      $scope.modal.hide();
    };

    $scope.showIntro = function() {
      debugger;
      $scope.listOrder = 'normal';
      $scope.modal.hide()
    }
  });

  /*.controller('PlayerCtrl', function($scope, $rootScope, $state, $ionicLoading, $interval, Player, tags, $ionicModal, $cordovaSocialSharing, $stateParams, queueService, PlayList) {

    $scope.currentPosition = 0;
    $scope.tags = _.pluck(tags, 'seconds');


    // var current = PlayList.getCurrent();

    $scope.playerConfig = {};

    $rootScope.$on('playerSetup', function(event, data) {

      // debugger;
    });
    // PlayList.playFromTop();
    // debugger;

    $rootScope.$on('playerPosition2', function(event, data) {
      console.log('playerPosition2!: ', data);
      $scope.currentPosition = data && data.position;
    });

    $ionicModal.fromTemplateUrl('templates/partials/player-options.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.shareEpisode = function() {

      $cordovaSocialSharing
        .share(message, subject, file, link) // Share via native share sheet
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occured. Show a message to the user
        });

      $cordovaSocialSharing
        .shareViaTwitter(message, image, link)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });

      $cordovaSocialSharing
        .shareViaWhatsApp(message, image, link)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });

      $cordovaSocialSharing
        .shareViaFacebook(message, image, link)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });

      // access multiple numbers in a string like: '0612345678,0687654321'
      $cordovaSocialSharing
        .shareViaSMS(message, number)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });

      // toArr, ccArr and bccArr must be an array, file can be either null, string or array
      $cordovaSocialSharing
        .shareViaEmail(message, subject, toArr, ccArr, bccArr, file)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });

      $cordovaSocialSharing
        .canShareVia(socialType, message, image, link)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });

      $cordovaSocialSharing
        .canShareViaEmail()
        .then(function(result) {
          // Yes we can
        }, function(err) {
          // Nope
        });



    };

    $scope.showSummary = function() {
      debugger;
      $scope.listOrder = 'reverse';
      $scope.modal.hide();
    };

    $scope.showIntro = function() {
      debugger;
      $scope.listOrder = 'normal';
      $scope.modal.hide()
    }
  });*/
