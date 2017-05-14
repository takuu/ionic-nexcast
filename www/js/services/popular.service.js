angular.module('nexcast.popular.service', []).service('popularService', function ($http, $q, $localStorage) {
  var url = API_URL + 'popular?category=All&max=200&order_type=asc';
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
      debugger;
      $http({method: 'GET', url: url + id, headers: { "token": $localStorage.token}}).
      success(function(data, status, headers, config) {
      // $http.get(url + id)
      //   .success(function (data) {
          var json = (typeof data === 'string') ? JSON.parse(data): data;
          resolve(json.result);
        })
        .error(function (err) { reject('update ' + name + ' failed: ' + err); });
    });
  }
});