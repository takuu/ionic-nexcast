angular.module('nexcast.subscribe.service', []).service('subscribeService', function ($http, $q, $localStorage, $rootScope) {
  var url = API_URL + 'subscribe?rssurl=';
  var Promise = $q;
  $localStorage.subscriptionList = $localStorage.subscriptionList || [];
  return {
    getData: _getData,
    add: _add,
    getAll: _getAll,
    remove: _remove,
    find: _find
  };

  function _updateFilter(name, value) {
    value = value || "";
    // url = helper.updateQueryString(url, name, value);
  }

  function _add(rss, image, title) {
    console.log('adding...');
    if(!_find(rss))
    $localStorage.subscriptionList.push({rss: rss, image: image, title: title, date: new Date()});
    $rootScope.$broadcast('updateSubscription', {length: $localStorage.subscriptionList.length});
  }

  function _getAll () {
    return $localStorage.subscriptionList;
  };

  function _find(rss) {
    return _.findIndex($localStorage.subscriptionList, {rss: rss}) >= 0;
  }

  function _remove (rss) {
    $localStorage.subscriptionList.splice(_.findIndex($localStorage.subscriptionList, {rss: rss}), 1);
    $rootScope.$broadcast('updateSubscription', {length: $localStorage.subscriptionList.length});
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