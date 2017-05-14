angular.module('nexcast.login.service', []).service('loginService', function ($http, $q) {
  var url = '';
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
      $http.get(url + id)
        .success(function (data) {
          var json = (typeof data === 'string') ? JSON.parse(data): data;
          resolve(json.result);
        })
        .error(function (err) { reject('update ' + name + ' failed: ' + err); });
    });
  }
});