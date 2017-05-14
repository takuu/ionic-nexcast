angular.module('nexcast.discover.services', [])

.service('DiscoverService', function ($http, $q, $rootScope, $localStorage){

  this.getEnrichedShows = function(){
    var dfd = $q.defer();

    // $http({method: 'POST', url: 'http://dev.nexcast.co/mapi/v1/popular?category=All&max=200&order_type=asc', headers: { "X-Token": '5fae9e8189b13ff117015b239cfdf4f2'}})
    //   .success(function(res, status, headers, config) {
    // $http.post(API_URL + 'popular?category=All&max=200&order_type=asc').success(function(res) {
    $http.post(API_URL + 'popular?category=All&max=200&order_type=asc').success(function(res) {
      if(res.status == 0 || res.status == -1) $rootScope.$broadcast('serverError', {});
      console.log("Enriched Shows: %o", res);

      var list = res.result;
      var top10 = list.splice(0,10);
      var top50 = list.splice(0,40);
      var top100 = list.splice(0,50);
      var top150 = list.splice(0,50);
      var top200 = list.splice(0,50);
      dfd.resolve({top10: top10, top50: top50, top100: top100, top150: top150, top200: top200});
    }).error(function(err, a, b) {
      dfd.reject('getEnrichedShows failed: ' + err);
    });
    return dfd.promise;
  };

  this.getCategories = function() {
    var dfd = $q.defer();
    // $http({method: 'GET', url: 'http://dev.nexcast.co/mapi/v1/categorylist', headers: { "X-Token": '5fae9e8189b13ff117015b239cfdf4f2'}})
    $http.get(API_URL + 'categorylist')
      .success(function(res) {
        debugger;
      if(res.status == 0) $rootScope.$broadcast('serverError', {});
      console.log("Categories List: %o", res);

      dfd.resolve(res.result);
    }).error(function(err) {
      dfd.reject('getCategories failed: ' + err);
    });
    return dfd.promise;
  };

  this.getCategory = function(cid){
    var dfd = $q.defer();
    $http.post(API_URL + 'popular?category='+cid+'&max=200&order_type=asc').success(function(res) {
      if(res.status == 0) $rootScope.$broadcast('serverError', {});
      console.log("Category cid: %o", cid);

      dfd.resolve(res.result);
    }).error(function(err) {
      dfd.reject('getCategory failed: ' + err);
    });
    return dfd.promise;
  }
  /*
  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('food_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
  */
});
