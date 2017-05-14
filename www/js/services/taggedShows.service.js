angular.module('nexcast.taggedShows.service', []).service('taggedShowsService', function ($http, $q) {
  var url = API_URL + 'taggedShows';
  var Promise = $q;
  return {
    getData: _getData
  };

  function _updateFilter(name, value) {
    value = value || "";
    // url = helper.updateQueryString(url, name, value);
  }

  function _getData() {
    return new Promise(function (resolve, reject) {
      $http.get(url)
        .success(function (data) {
          var json = (typeof data === 'string') ? JSON.parse(data): data;
          if(json && json.status != 1) reject('fail');
          if(json && json.status == 1) resolve(json.result);
        })
        .error(function (err) { reject('update ' + name + ' failed: ' + err); });
    });
  }
});