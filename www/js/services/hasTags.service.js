angular.module('nexcast.hasTags.service', []).service('hasTagsService', function ($http, $q) {
  var url = API_URL + 'hastag?rssurl=';
  var Promise = $q;
  return {
    getTags: _getTags
  };

  function _updateFilter(name, value) {
    value = value || "";
    // url = helper.updateQueryString(url, name, value);
  }

  function _getTags(id) {
    return new Promise(function (resolve, reject) {
      $http.post(url + id)
        .success(function (data) {
          var json = (typeof data === 'string') ? JSON.parse(data): data;
          resolve(json.tags);
        })
        .error(function (err) { reject('update ' + name + ' failed: ' + err); });
    });
  }
});