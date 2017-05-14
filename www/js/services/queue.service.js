angular.module('nexcast.queue.service', []).service('queueService', function ($http, $q, $localStorage, $rootScope) {
  var Promise = $q;
  var currentIterator = 0;
  $localStorage.queueList = $localStorage.queueList || [];
  /*$localStorage.queueList.unshift({
    "podcastTitle": "Heavyweight",
    "imageUrl": "http://panoply-prod.s3.amazonaws.com/podcasts/37595324-4dcc-11e6-8a94-1f35a…jnrwesu-02db68535b643721514257ab1265616a_2FHeavyweight-show-art-1500px.png",
    "parsedDescription": "20 years ago, Gregor lent some CDs to a musician friend. The CDs helped make him a famous rockstar. Now, Gregor would like some recognition. But mostly, he wants his CDs back.Our SponsorsMailchimp – More than 12 million people use MailChimp to connect with their customers, market their products, and grow their businesses every day.Prudential - Download the MapMyRun app and join the Prudential 4.01K challenge. When you do, pledge to save at least 1% or more of your annual income for retirement and run and log 4.01K to be eligible to win a prize.Squarespace – The easiest way to create a beautiful website, portfolio or online store. Use the offer code “HEAVYWEIGHT\" to get 10% off your first purchase.Wealthsimple – Investing made easy. Get your first $10,000 managed for free.CreditsHeavyweight is hosted and produced by Jonathan Goldstein, along with Wendy Dorr, Chris Neary, and Kalila Holt. Editing by Alex Blumberg & Peter Clowney.  Special thanks to Emily Condon, Jackie Cohen, Paul Tough, Stevie Lane, Michelle Harris, Dimitri Erlich, Sean Cole and Jorge Just. The show was mixed by Haley Shaw. Music for this episode by Christine Fellows, with additional music by Takstar, The Eastern Watershed Klezmer Quartet and Haley Shaw, who also did our ad music. Our theme song is by The Weakerthans courtesy of Epitaph Records.",
    "media_location": "http://traffic.megaphone.fm/GLT1741636493.mp3?updated=1474689332",
    "episodeTitle": "#2 Gregor",
    "episodeDate": "2016-09-24T04:08:00.000Z",
    "duration": "2671"
  });
    $localStorage.queueList.unshift({
      "podcastTitle": "How I Built This",
      "imageUrl": "https://media.npr.org/assets/img/2016/08/31/hibt_podcast_tile_sq-8d9498b292dc7a759bf4b7fc776dfe0e4c09da68.png?s=1400",
      "parsedDescription": "Kevin Systrom and Mike Krieger launched their photo-sharing app with a server that crashed every other hour. Despite a chaotic start, Instagram became one of the most popular apps in the world.",
      "media_location": "http://play.podtrac.com/npr-510313/npr.mc.tritondigital.com/NPR_510313/medi…Id=1&d=1795&p=510313&story=493923357&t=podcast&e=493923357&ft=pod&f=510313",
      "episodeTitle": "Instagram: Kevin Systrom & Mike Krieger",
      "episodeDate": "2016-09-19T04:01:27.000Z",
      "duration": "1795"
    });
    $localStorage.queueList.unshift({
      "podcastTitle": "Secrets, Crimes & Audiotape",
      "imageUrl": "https://dfkfj8j276wwv.cloudfront.net/images/78/3a/23/ca/783a23ca-2436-46f5-…b14ec66ba6b9417b5dcc11e9dfa51abc9d011e50eef9eda008833aca5956e76d4a685.jpeg",
      "parsedDescription": "\n        Franny's secret is that she has been taking melatonin -- and Jim has revealed some secrets of his own. Will role playing help them put the spark back into their marriage?\n\n \nThe dark comedy, “A Beautiful Spell” is the first story from Secrets, Crimes & Audiotape.  Told over 3 episodes, real life couple Bodhi & Jenna Elfman play a Jim & Franny who spend one night walking through their insecurities, jealousies and fantasies.\n      ",
      "media_location": "http://rss.art19.com/episodes/5b6ac4d1-f27c-44e3-a661-263b9dcc2450.mp3",
      "episodeTitle": "1 | A Beautiful Spell - Part Two",
      "episodeDate": "2016-09-20T09:05:00.000Z",
      "duration": "3600"
    });*/

  return {
    add: _add,
    getAll: _getAll,
    remove: _remove,
    find: _find,
    getNext: _getNext,
    addToFront: _addToFront,
    removeFront: _removeFront,
    findAndMoveToTop: _findAndMoveToTop,
    setElapsedPlaybackTime: _setElapsedPlaybackTime,
    getElapsedPlaybackTime: _getElapsedPlaybackTime
  };

  // TODO: USING media_location as an ID.... Refactor this once when there is a legit ID

  function _add(episode) {
    console.log('adding...');
    if(!_find(episode.media_location))
      $localStorage.queueList.push(episode);
  }

  function _setElapsedPlaybackTime(seconds, episode) {
    var index = _.findIndex($localStorage.queueList, {media_location: episode.media_location});
    if (index >= 0) {
      $localStorage.queueList[index].elapsedPlaybackTime = seconds;
    }
  }

  function _getElapsedPlaybackTime(episode) {
    var index = _.findIndex($localStorage.queueList, {media_location: episode.media_location});
    if (index >= 0) {
      return $localStorage.queueList[index].elapsedPlaybackTime || 0;
    } else {
      return 0;
    }
  }


  function _addToFront(episode) {
    console.log('adding to front of line...');
    if(!_find(episode.media_location))
      $localStorage.queueList.unshift(episode);
    $rootScope.$broadcast('updateQueue', {length: $localStorage.queueList.length});
  }

  function _findAndMoveToTop(episode) {

    var index = _.findIndex($localStorage.queueList, {media_location: episode.media_location});

    if (index > 0) {
      $localStorage.queueList.splice(index,1);
      _addToFront(episode);
    }
    $rootScope.$broadcast('updateQueue', {length: $localStorage.queueList.length})
  }


  function _removeFront() {
    $localStorage.queueList.shift();
    $rootScope.$broadcast('updateQueue', {length: $localStorage.queueList.length})
  }

  function _getAll () {
    return $localStorage.queueList;
  }

  function _getNext() {

  }

  function _find(media) {
    return _.findIndex($localStorage.queueList, {media_location: media}) >= 0;
  }

  function _remove (media) {
    var index = _.findIndex($localStorage.queueList, {media_location: media});
    $localStorage.queueList.splice(index, 1);
    $rootScope.$broadcast('updateQueue', {length: $localStorage.queueList.length});
    return index;
  }


});