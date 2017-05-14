angular.module('nexcast.playlist.singleton', []).service('PlayList', function ($http, $rootScope, $q, queueService, Player, $timeout, $state) {

  var CONTINUE_PLAYING = true;
  var queue = queueService.getAll();

  $rootScope.$on('mediaFinished', function(event, data) {
    var index;
    if(data.mp3) {
      index = queueService.remove(data.mp3);
      // queueService.removeFront();
      queue = queueService.getAll();
      debugger;
      _playNext(index);
    } else {
      // This isn't completed but interrupted
      debugger;
    }


    console.log('PLAYER FACTORY!  MEDIA FINISHED!  GET NEXT!');
  });

  return {
    playNext: _playNext,
    playEpisode: _playEpisode,
    playFromTop: _playFromTop,
    play: _play,
    pause: _pause,
    addToPlayList: _addToPlayList
  };


  function _play() {
    if(Player.hasInstance()) {
      Player.play('singleton');
    }
  }

  function _addToPlayList(episode) {
    queueService.add(episode);
    queue = queueService.getAll();
  }

  function _playFromTop() {
    var next = queue[0] || {};
    debugger;

    if (typeof cordova != 'undefined' && cordova.platformId == 'ios') {
      Player.createPlayer('ios', next.media_location, _onload);
    } else {
      Player.createPlayer('android', next.media_location, _onload );
    }

    function _onload() {

      console.log('player successfully loaded1');

      if(CONTINUE_PLAYING) {
        var elapsedTime = queueService.getElapsedPlaybackTime(next);
        Player.setPosition(parseInt(elapsedTime));

        Player.setTitle(next.podcastTitle || '');
        Player.setSubTitle(next.episodeTitle || '');
        Player.play();
        $rootScope.$broadcast('playerLoaded', {episode: next, continuePlaying: true});
      }
    };
  }

  function _playEpisode(episode) {
    var index = _.findIndex(queue, {media_location: episode.media_location});
    if(index >= 0) {
      _playNext(index);
    } else {
      debugger;
      queueService.addToFront(episode);
      _playNext(0);

    }

  }

  function _playNext(index) {
    var next = queue[index || 0] || {};
    if (Player.hasInstance()) Player.unload();

    if (typeof cordova != 'undefined' && cordova.platformId == 'ios') {
      Player.createPlayer('ios', next.media_location, _onload, _onerror, next);
    } else {
      Player.createPlayer('android', next.media_location, _onload, _onerror, next);
    }

    function _onerror(e) {alert('ERror: ' + e)}
    function _onload(episode) {

      console.log('player successfully loaded2');

      if(CONTINUE_PLAYING) {
        // var elapsedTime = queueService.getElapsedPlaybackTime(episode);
        // if(parseInt(elapsedTime) > 15) Player.setPosition(parseInt(elapsedTime));
        // debugger;

        Player.setTitle(next.podcastTitle || next.title || '');
        Player.setSubTitle(next.episodeTitle || '');
        Player.play();
        $rootScope.$broadcast('playerLoaded', {episode: next, continuePlaying: true});
      }
    }

  }

  function _pause() {
    Player.pause();
  }


});