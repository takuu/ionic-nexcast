angular.module('nexcast.getEpisodesByRSS.service', []).service('getEpisodesByRSSService', function ($http, $q, $rootScope) {
  var url = API_URL + 'getEpisodesByRss?rss=';
  var Promise = $q;
  return {
    getData: _getData
  };

  function _updateFilter(name, value) {
    value = value || "";
    // url = helper.updateQueryString(url, name, value);
  }

  function _getData(id) {
    return new Promise(function (resolve, reject) {

      $http.post(url + id)
        .success(function (data) {
          var json = (typeof data === 'string') ? JSON.parse(data): data;
          if(json.result) {
            _.map(json.result.episodes, function(episode) {
              episode.prettyDuration = _prettyDuration(hmsToSecondsOnly(episode.duration));
              var div = document.createElement("div");
              div.innerHTML = episode.description;
              var text = div.textContent || div.innerText || "";
              episode.parsedDescription = text;
              episode.prettyDate = _prettyDate(episode.pubDate);
              return episode;
            });
          }
          resolve(json.result);
        })
        .error(function(err) {
          $rootScope.$broadcast('connectionError', {});
          dfd.reject('getCategory failed: ' + err);
        });
    });
  }
});