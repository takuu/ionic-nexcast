
function getEpisode(episode, show) {
  var div = document.createElement("div");
  div.innerHTML = episode.description;
  var parsedDescription = div.textContent || div.innerText || "";
  var episodeDate = new Date(episode.pubDate);

  var today = new Date();
  var dateDifference = (today - episodeDate) / (1000*60*60*24);

  var prettyDate = (dateDifference < 7) ? moment(episodeDate).format('dddd') : moment(episodeDate).format('MMM Do');

  var prettyDuration = _prettyDuration(episode.duration);
  /*
    {podcastTitle: show.title, imageUrl: show.imageurl, parsedDescription: episode.parsedDescription,
    media_location: episode.media_location, episodeTitle: episode.title, episodeDate: new Date(episode.pubDate), duration: episode.duration}
  */
  return {podcastTitle: show.title, imageUrl: show.imageurl, parsedDescription: parsedDescription, prettyDate: prettyDate, prettyDuration: prettyDuration,
    media_location: episode.media_location, episodeTitle: episode.title, episodeDate: episodeDate, duration: episode.duration, episode_key: episode.episode_key,
    seconds: hmsToSecondsOnly(episode.duration)
  }
}


function hmsToSecondsOnly(str) {
  var p = str.split(':'),
    s = 0, m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  return s;
}

function secondsToHMS(seconds) {
  var start = 11;
  var length = 8;
  if(seconds < 3600) {
    start = 14;
    length = 5;
  }
  return new Date(seconds * 1000).toISOString().substr(start, length);
}

function isURL(str) {
  var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}

function _prettyDuration (duration) {
  var hours = moment.duration(parseInt(duration)*1000).hours();
  var minutes = moment.duration(parseInt(duration)*1000).minutes();
  var prettyHours = (hours > 0) ? hours + ' hr' : '';
  var prettyMinutes = (minutes > 0) ? minutes + ' min' : '';
  return prettyHours + '' + prettyMinutes;
}

function _prettyDate (date) {
  var today = new Date();
  var dateDifference = (today - date) / (1000*60*60*24);

  return (dateDifference < 7) ? moment(date).format('dddd') : moment(date).format('MMM Do');
}

function linkify(text) {
  var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(urlRegex, function(url) {
    return '<a class="green-link" href="#" onclick="window.open(\'' + url + '\', \'_blank\', \'location=yes\')">' + url + '</a>';
  });
}