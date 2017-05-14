angular.module('nexcast.register.service', []).service('RegisterService', function ($http, $q) {
  var url = API_URL + 'register_device/';
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
          resolve(json);
        })
        .error(function (err) { reject('update ' + name + ' failed: ' + err); });
    });
  }
});