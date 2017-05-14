angular.module('nexcast.player.singleton', []).service('Player', Player);
Player.$inject = ["$http", "$q", "$rootScope", "queueService", "$timeout", "$interval"];
function Player($http, $q, $rootScope, queueService, $timeout, $interval) {

  var player;
  var status = 0;
  var title = '';
  var subTitle = '';
  var mediaUrl = '';
  var interval;
	var currentRate = 1;
	var TIMER_INTERVAL = 1000;
	var currentEpisode = {};
	var reSeek = false;
	var loaded = false;

  var sound;

  return {
    createPlayer: _PlayerFactory,
    getInstance: _getInstance,
    hasInstance: _hasInstance,
    setTitle: _setTitle,
    setSubTitle: _setSubTitle,
    getTitle: _getTitle,
    getSubTitle: _getSubTitle,
    getStatus: function() {return status;},
    getMediaUrl: function() { return mediaUrl;},
    play: function() { if(status != 2) player.play(); },
    pause: function() { if(status != 3) player.pause(); },
    unload: function(a) { player.unload(a); },
    load: function() { player.load(); },
    setRate: function(s) { player.setRate(s); },
    getPosition: function() {
      return player.getPosition();
    },
    setPosition: function(s) {
      player.setPosition(s)
    },
		getEpisode: currentEpisode,
    duration: function() { return player.duration(); }

  };

  function _getInstance() {
    return player;
  }

  function _hasInstance() {
    return !!player;
  }

  function _PlayerFactory (os, url, callback, onError, episode) {
    mediaUrl = url;
		$interval.cancel(interval);

		currentEpisode = episode;
    if (player) player.unload();
    JS_ID = undefined;
		reSeek = false;
		loaded = false;
    switch(os) {
      case 'ios':
        player = IOSPlayer(url, callback, onError, episode);
        $rootScope.$broadcast('playerSetup', {player: player});
        // setTimeout(function(){callback()}, 1);
        break;
      case 'android':
        player = JSPlayer(url, callback, onError, episode);
        $rootScope.$broadcast('playerSetup', {player: player});
        break;
      default:
        player = JSPlayer(url, callback, onError, episode);
        $rootScope.$broadcast('playerSetup', {player: player});
        break;
    }



    return player;
  }

  function _setTitle(t) {
    title = t;
  }

  function _setSubTitle(s) {
    subTitle = s;
  }

  function _getTitle() {
    return title;
  }

  function _getSubTitle() {
    return subTitle;
  }

  var JS_ID;
  function JSPlayer(url, onload, onError, episode) {
    status = 0;
    var isCompleted = {};

    // url = 'http://localhost:8100/mock/moo.mp3';
    if(!url) {
      console.error('provide mp3 url for player');
      debugger;
      return;
    }
    // debugger;
    sound = new Howl({
      src: [url],
      onload: onload,
      unload: _unload,
      pool: 1,
      onplay: function(id) {
        JS_ID = id;
        status = 2;
        console.log('onplay', status);
        $rootScope.$broadcast('playerStatus', {playing: true});
      },
      onpause: function(id) {
        status = 3;
        console.log('onplay', status);
        $rootScope.$broadcast('playerStatus', {playing: false});
      },
      onend: function() {
      }
    });

    sound.on('end', function() {
      status = 4;
      console.log(isCompleted);

      $rootScope.$broadcast('mediaFinished', isCompleted);

      debugger;
      // _unload();

    });

    return {
      play: _play,
      pause: _pause,
      unload: _unload,
      load: _load,
      setRate: _setRate,
      getPosition: _getPosition,
      setPosition: _setPosition,
      duration: _duration
    };

    function _play() {
      sound.play(JS_ID);
      console.log('play: ', status);
      interval = $interval(sendSeek, TIMER_INTERVAL);

    }

    function sendSeek() {
      _getPosition().then(function(position) {

        console.log('sendSeek pos: ', position);
        var duration = _duration();
        if(duration > 0 && position >= (duration-1)) {
          debugger;
          isCompleted = {mp3: url, completed: true};
        }
				queueService.setElapsedPlaybackTime(position, currentEpisode);
        $rootScope.$broadcast('playerPosition2', {position: position, status: status});
      })
    }
    function _pause() {
      console.log('status: ', status);
      sound.pause(JS_ID);

      $interval.cancel(interval);
    }

    function _unload() {
      sound.unload();
      status = 0;
      JS_ID = undefined;
      player = undefined;
      sound = undefined;
      isCompleted = {};
      $interval.cancel(interval);
    }

    function _load() {

    }

    function _setRate(rate) {
			currentRate = rate;
      sound.rate(rate, JS_ID);
    }

    function _getPosition() {
      var deferred = $q.defer();
      deferred.resolve(sound.seek(JS_ID));
      return deferred.promise;
    }
    function _setPosition(pos) {
      sound.seek(pos, JS_ID);
      sendSeek();
    }

    function _duration() {
      return sound.duration(JS_ID);
    }
  }
  // var Media = function() {};

  function IOSPlayer(url, onload, onError, episode) {
    status = 0;
    var isCompleted = {};
    var SEEK_DISPLACEMENT = 15;


    sound = new Media(url, onSuccess, onError, getStatus);
    document.addEventListener("deviceready", function() {
			loaded = false;
			reSeek = false;
			sound.setVolume(0);
			$interval.cancel(interval);
		}, false);
		sound.play();
    // alert(sound.duration(JS_ID));
		sound.setRate(currentRate);

    //"http://is3.mzstatic.com/image/thumb/Music62/v4/3c/02/5b/3c025b60-738d-40c5-6fe7-691430162a7f/source/350x350.jpg"

    NowPlaying.set({
      artwork: episode.imageUrl, // Can be http:// https:// or image path relative to NSDocumentDirectory
      // albumTitle: "albumTitle",
      // trackCount: 10,
      // trackNumber: 1,
      artist: episode.podcastTitle,
      // composer: "The Composer",
      // discCount: 1,
      // discNumber: 1,
      genre: "The Genre",
      persistentID: episode.episode_key,
      playbackDuration: episode.seconds,
      title: episode.episodeTitle,
      elapsedPlaybackTime: 0,
      playbackRate: 1,
      // playbackQueueIndex: 1,
      // playbackQueueCount: 5,
      // chapterNumber: 1,
      chapterCount: 2
    });

    // or listen to them seperatly
    RemoteCommand.on('play', function () {
      sound.play();
    });

    RemoteCommand.on('pause', function () {
      sound.pause();
    });

    RemoteCommand.on('nextTrack', function () {
      _forwardSeek();

    });

    RemoteCommand.on('previousTrack', function () {
      _backSeek();
    });


    /*
    function remoteCommandCallback(event,value){
      switch(event){
        case RemoteCmdPlayingInfo.EVENT_PLAY:
          console.log("######### remoteCommandCallback, event: PLAY");
          //"value" is zero for this event
          if(sound) sound.play();
          break;
        case RemoteCmdPlayingInfo.EVENT_PAUSE:
          console.log("######### remoteCommandCallback, event: PAUSE");
          //"value" is zero for this event
          if(sound) sound.pause();
          break;
        case RemoteCmdPlayingInfo.EVENT_TOGGLE_PLAY_PAUSE:
          console.log("######### remoteCommandCallback, event: TOGGLE PLAY PAUSE");
          //"value" is zero for this event
          if(sound){
            if(status == 3) _play();
            else _pause();
          }
          break;

        case RemoteCmdPlayingInfo.EVENT_SKIP_FORWARD:
          console.log("######### remoteCommandCallback, event: SKIP FW");
          //"value" is the amout of seconds to skip (the value in info.skipForwardValue)
          if(sound){
           _forwardSeek();
          }
          break;
        case RemoteCmdPlayingInfo.EVENT_SKIP_BACKWARD:
          console.log("######### remoteCommandCallback, event: SKIP BW");
          //"value" is the amout of seconds to skip (the value in info.skipBackwardValue)
          if(sound){
           _backSeek(value);
          }
          break;
        case RemoteCmdPlayingInfo.EVENT_NEXT_TRACK:
          console.log("######### remoteCommandCallback, event: NEXT Track");
          //"value" is zero for this event
          break;
        case RemoteCmdPlayingInfo.EVENT_PREV_TRACK:
          console.log("######### remoteCommandCallback, event: PREVIOUS Track");
          //"value" is zero for this event
          break;
      }

    }


    var info={
      title: episode.podcastTitle,
      albumTitle: episode.episodeTitle,
      artwork: episode.,
      albumTrackCount:10,
      albumTrackNumber:1,
      playbackDuration:episode.seconds, //in seconds
      playbackPosition:0, //in seconds, usually this is zero
      playbackRate:1.0,
      skipForwardValue:15,
      skipBackwardValue:15,
      receiveNextTrackEvent:0,
      receivePrevTrackEvent:0
    };


  var remoteCmdPlayingInfo = new RemoteCmdPlayingInfo(info,remoteCommandCallback);

    */








    return {
      play: _play,
      pause: _pause,
      unload: _unload,
      load: _load,
      setRate: _setRate,
      getPosition: _getPosition,
      setPosition: _setPosition,
      duration: _duration
    };

    function onSuccess() {
      _unload();
      $rootScope.$broadcast('mediaFinished', {mp3: url});
    }
    function onError(e) { alert('Player Error Code: ' + e.code + ' ' + e.message);}
    function getStatus(st) {
				// First time loaded
        if(st == 2 && !loaded) {
            loaded = true;
						// Reset here

            onload();
					reSeek = false;
        }
        $rootScope.$broadcast('playerStatus', {playing: (st == 2)});
      status = st;
    }
    function _play () {
      status = 2;
      sound.play();
      $rootScope.$broadcast('playerStatus', {playing: true});
      $interval.cancel(interval);
      interval = $interval(sendSeek, TIMER_INTERVAL);
    }


    function sendSeek() {
      _getPosition().then(function(position) {

				_checkIfPlayerStarted(position);

        var duration = _duration();
        if(duration > 0 && position >= (duration-1)) {
          isCompleted = {mp3: url, completed: true};
        }
				if (position > 15) queueService.setElapsedPlaybackTime(position, currentEpisode);
        $rootScope.$broadcast('playerPosition2', {position: position, status: status});
        $interval.cancel(interval);
        interval = $interval(sendSeek, TIMER_INTERVAL);
      });
    }


		function _checkIfPlayerStarted(pos) {
			var elapsedTime = queueService.getElapsedPlaybackTime(currentEpisode);

			// alert('whats going on: ' + elapsedTime + ' ' + pos + ' ' + reSeek);
			// if(parseInt(elapsedTime) > 0 && !reSeek) sound.setVolume(0);
			if(parseInt(pos) > 0 && !reSeek) {
				// alert('set reSeek to true');
				reSeek = true;
				if(parseInt(elapsedTime) > 15) _setPosition(parseInt(elapsedTime));
				$timeout(function(){sound.setVolume(1);}, 1000);
				_play();
			}
		}

    function _pause () {
      sound.pause();
      status = 3;
      $rootScope.$broadcast('playerStatus', {playing: false});
      $interval.cancel(interval);
    }

    function _forwardSeek () {
      _getPosition().then(function(position) {
        var newPos = parseInt(position) + SEEK_DISPLACEMENT;
        var duration = parseInt(_duration());
        if(newPos > duration) newPos = duration;
        _setPosition(newPos);
      });
    }

    function _backSeek () {
      _getPosition().then(function(position) {
        var newPos = parseInt(position) - SEEK_DISPLACEMENT;
        if (newPos < 0) newPos = 0;
        _setPosition(newPos);
      });
    }

    function _unload() {
      if(sound) {
        // sound.stop();
        sound.release();
      }
      sound = undefined;
      player = undefined;
      status = 0;
      isCompleted = {};
      $interval.cancel(interval);
    }

    function _load() {

    }

    function _setRate(rate) {
			currentRate = rate;
      sound.setRate(rate);
    }

    function _getPosition() {
      var deferred = $q.defer();
      sound.getCurrentPosition(function(position) {
        deferred.resolve(position);
      });
      return deferred.promise;
    }

    function _setPosition(pos) {
      debugger;


      if(isPlayerLoaded()) sound.seekTo(parseInt(pos)*1000);
      NowPlaying.set({elapsedPlaybackTime: pos});

      // Set position automatically forces it to play
      status = 2;
      $rootScope.$broadcast('playerStatus', {playing: true});

			$timeout(function() {
				sound.setRate(currentRate);
			}, 400);
      $interval.cancel(interval);
			interval = $interval(sendSeek, TIMER_INTERVAL);
    }

    // Some hacky way to know if they player is loaded
    function isPlayerLoaded() {
      var isLoaded = false;
      if(sound && _duration() > 0) {
        isLoaded = true;
      }

      return isLoaded;
    }

    function _duration() {
      return sound.getDuration();
    }

  }

}