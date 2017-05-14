var app = angular.module('nexcast', [
    'ionic',
    'ngCordova',
    'ngStorage',
    // 'underscore',
    'nexcast.home.controllers',
    'nexcast.player.controllers',
    'nexcast.profile.controllers',
    'nexcast.queue.controllers',
    'nexcast.episodeList.controllers',
    'nexcast.subscriptionList.controllers',
    'nexcast.search.controllers',
    'nexcast.searchItem.controllers',
    'nexcast.mypodcasts.controllers',
    'nexcast.mypodcastsItem.controllers',
    'nexcast.mypodcastsShow.controllers',
    'nexcast.discover.controllers',
    'nexcast.discoverEnriched.controllers',
    'nexcast.discoverItem.controllers',
    'nexcast.categoryList.controllers',
    'nexcast.category.controllers',
    'nexcast.taggedShows.controllers',

    'nexcast.tags.service',
    'nexcast.getEpisodesByRSS.service',
    'nexcast.hasTags.service',
    'nexcast.login.service',
    'nexcast.popular.service',
    'nexcast.register.service',
    'nexcast.search.service',
    'nexcast.subscribe.service',
    'nexcast.queue.service',
    'nexcast.register.service',
    'nexcast.taggedShows.service',
    'nexcast.playlist.singleton',

    'nexcast.player.singleton',
    'nexcast.discover.services',
    'jett.ionic.filter.bar',
    'nexcast.player.component',
    'nexcast.miniPlayer.component',
    'nexcast.textCollapse.component',
    'nexcast.playerWrapper.layout.component',
    'nexcast.tags.component'
    // 'nexcast.goNative.component'
])

.run(function($ionicPlatform, Player, $rootScope, PlayList, $timeout, $localStorage, DiscoverService, RegisterService, $ionicModal, TagService) {


  $ionicPlatform.ready(function() {
    var uniqueDate;
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    window.setTimeout(function () {
      if(navigator && navigator.splashscreen) navigator.splashscreen.hide();
    }, 5000);


    // Fetch a token from server
    if(!$localStorage.token) {


      if(typeof device != 'undefined' && device.uuid) {
        // this is a device
        $localStorage.uniqueId = $localStorage.uniqueId || device.uuid;
        _success(device.uuid);

      } else {
        // this is your computer
        uniqueDate = (new Date).getTime() + 'rand' + parseInt(Math.random() * 100000000);
        $localStorage.uniqueId = $localStorage.uniqueId || uniqueDate;
        _success($localStorage.uniqueId);
      }


    }

    function _success(id) {
      RegisterService.getData(id).then(function(data) {

        if (data.status == 1) {
          $localStorage.token = data.token;
          _init();
        }
      });
    }

    function _init () {
      // preload these because they slow...

      DiscoverService.getCategories().then(function(categories) {
        if (categories) $localStorage.categoryList = categories;
      });

      DiscoverService.getEnrichedShows().then(function(shows) {
        if (!shows) return;
        $localStorage.enrichedListTop10 = shows.top10;
      });
    }


    $rootScope.Player = Player;

    $rootScope.PlayList = PlayList;
    $rootScope.discoverHistory = $rootScope.discoverHistory || [];

    $rootScope.$on('updateQueue', function(event, data) {
      $rootScope.queueLength = data.length;
    });
    $rootScope.$on('updateSubscription', function(event, data) {
      $rootScope.subscriptionLength = data.length;
    });

    $rootScope.$on('serverError', function(event, data) {
      $rootScope.hasServerError = true;
      $timeout(function() {$rootScope.hasServerError = false;}, 5000);
    });
    $rootScope.$on('connectionError', function(event, data) {
      $rootScope.hasConnectionError = true;
      $timeout(function() {$rootScope.hasConnectionError = false;}, 5000);
    });

    $ionicModal.fromTemplateUrl('templates/player-content.html', {
      scope: $rootScope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $rootScope.modal = modal;
    });
    $rootScope.openModal = function() {
      $rootScope.modal.show();
    };
    $rootScope.closeModal = function() {
      $rootScope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $rootScope.$on('$destroy', function() {
      $rootScope.modal.remove();
    });

    var episodeKey;
    $rootScope.$on('showPlayer', function(event, data) {

      PlayList.playEpisode(data.episode);
      episodeKey = data.episode.episode_key;
      TagService.getTags(data.episode.episode_key).then(function(data) {
        var IS_TEST = 0;

        if(IS_TEST) {
          $rootScope.tags = [{"cards_sid":123,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:04:00","content":"some text ....asd","button1_text":"","button1_link":"","image_location":"http:\/\/nexcast.co\/users\/media\/123\/123.jpg","status":1,"created_at":"2016-06-14 06:10:49","updated_at":"2016-06-14 06:10:49","seconds":240},{"cards_sid":124,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:09:00","content":"test","button1_text":"","button1_link":"","image_location":"","status":0,"created_at":"2016-06-14 06:13:14","updated_at":"2016-06-14 06:13:14","seconds":540},{"cards_sid":133,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:11:00","content":"asdfadsff","button1_text":"","button1_link":"","image_location":"http:\/\/nexcast.co\/users\/media\/133\/133.jpg","status":1,"created_at":"2016-06-15 06:06:54","updated_at":"2016-06-15 06:06:54","seconds":660}];
        } else {
          $rootScope.tags = data;
        }

        $rootScope.tagPositions = _.pluck($rootScope.tags, 'seconds');

      });
      // $rootScope.episode = data.episode;
      $rootScope.openModal(data.episode);

    });
    // Execute action on hide modal
    $rootScope.$on('modal.hidden', function() {
      // Execute action
    });

    var DISCOVER_TAB = ['app.tab.discover.tagged', 'app.tab.discover.home', 'app.tab.discover.categories'];
    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
      $rootScope.hasInstance = Player.hasInstance();

      var index = _.findIndex(DISCOVER_TAB, function(route) {
        return route == toState.name;
      });
      if(index >= 0 && $rootScope.discoverHistory) $rootScope.discoverHistory.unshift(toState.name);
      debugger;
    });
    $rootScope.$on('playerLoaded', function(event, data) {
      var episode = data.episode || {};
      debugger;
      $rootScope.hasInstance = Player.hasInstance();

      if (episodeKey != episode.episode_key) {
        TagService.getTags(episode.episode_key).then(function(data) {
          var IS_TEST = 0;

          if(IS_TEST) {
            $rootScope.tags = [{"cards_sid":123,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:04:00","content":"some text ....asd","button1_text":"","button1_link":"","image_location":"http:\/\/nexcast.co\/users\/media\/123\/123.jpg","status":1,"created_at":"2016-06-14 06:10:49","updated_at":"2016-06-14 06:10:49","seconds":240},{"cards_sid":124,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:09:00","content":"test","button1_text":"","button1_link":"","image_location":"","status":0,"created_at":"2016-06-14 06:13:14","updated_at":"2016-06-14 06:13:14","seconds":540},{"cards_sid":133,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:11:00","content":"asdfadsff","button1_text":"","button1_link":"","image_location":"http:\/\/nexcast.co\/users\/media\/133\/133.jpg","status":1,"created_at":"2016-06-15 06:06:54","updated_at":"2016-06-15 06:06:54","seconds":660}];
          } else {
            $rootScope.tags = data;
          }

          $rootScope.tagPositions = _.pluck($rootScope.tags, 'seconds');

        });
        episodeKey = episode.episode_key
      }


    });

  });
  // http://dev.nexcast.co/mapi/v1/register_device/{device_id}


});

app.factory('ApiInterceptor', function ($rootScope, $localStorage) {

  return {
    request: function(config) {
      var parts = config.url.split('/');
      if(_.contains(parts, 'mapi')) {
        if(!_.contains(parts, 'register_device')) {
          config.headers['X-Token'] = $localStorage.token;
        }
      }
      return config;
    },
    requestError: function(config) {
      return config;
    },
    response: function(res) {
      var urlPrefix = res.config.url.split('/')[3];
      if(urlPrefix == 'api') {
        if(res.data.status == 0) {
          $rootScope.$broadcast('serverError', {});
        }
      }
      return res;
    },
    responseError: function(res) {
      $rootScope.$broadcast('connectionError', {});
      return res;
    }
  }
});

app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);

    $urlRouterProvider.when('', '/app/tab/discover/tagged');
    $urlRouterProvider.when('/', '/app/tab/discover/tagged');

    $stateProvider

    //------------------------
    // Home Page
    //------------------------
    .state('/', {
      url: '/',
      templateUrl: 'templates/home.html'
    })

    //------------------------
    // Auth
    //------------------------
    .state('/login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })
    .state('/signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html'
    })

    .state('/forgot-password', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
    })

    .state('player', {
      url: '/player/?title&subTitle&mp3',
      templateUrl: 'js/containers/player/mainPlayer.html',
      controller: 'PlayerMainCtrl',
      data: {
        episode: {}
      },
      resolve: {
        tags: function(TagService, $stateParams) {
          return TagService.getTags($stateParams.key);
        }
      }
    })


    .state('app.tab', {
        url: '/tab',
        abstract: true,
        views: {
            'menu-content': {
                templateUrl: 'templates/tabs.html'
            },
            'menu-left': {
                templateUrl: 'templates/menu-sidemenu.html',
            }
        }
    })
    //--------------------------------
    // search
    //--------------------------------

    // .state('app.tab.search', {
    //   url: '/search',
    //   abstract: true,
    //   templateUrl: 'js/containers/search/tab-search.html-old'
    // })

    .state('app.tab.search', {
      url: '/search?rss',
      data: {
        shows: []
      },
      views: {
        'tab-search': {
          templateUrl: 'js/containers/search/tab-search-list.html',
          controller: 'searchCtrl'

        }
      }
    })
    .state('app.tab.searchItem', {
      url: '/searchItem/?rss',
      data: {
        episode: {},
        shows: []
      },
      views: {
        'tab-search': {
          templateUrl: 'js/containers/search/tab-search-item.html',
          controller: 'searchItemCtrl'

        }
      }
    })


    //--------------------------------
    // Discover
    //--------------------------------
    .state('app.tab.discover', {
        url: '/discover',
        views: {
            'tab-discover': {
                templateUrl: 'js/containers/discover/tab-discover.html',
                controller: 'DiscoverCtrl'
            }
        }
    })
    .state('app.tab.discoverItem', {
        url: '/discoverItem/?rss',
        data: {
            episode: {},
            shows: []
        },
        views: {
            'tab-discover': {
                templateUrl: 'js/containers/discover/tab-discover-item.html',
                controller: 'DiscoverItemCtrl'

            }
        }
    })

    .state('app.tab.discover.home', {
        url: '/home',
        views: {
            'tab-discover-home': {
                templateUrl: 'js/containers/discover/enriched/tab-discover-home.html',
                controller: 'DiscoverEnrichedCtrl'
            }
        },
        resolve : {
          token : function($localStorage, RegisterService, $q) {

            var defer = $q.defer();
            if(!$localStorage.token) {


              if(typeof device != 'undefined' && device.uuid) {
                // this is a device
                $localStorage.uniqueId = $localStorage.uniqueId || device.uuid;d;

              } else {
                // this is your computer
                uniqueDate = (new Date).getTime() + 'rand' + parseInt(Math.random() * 100000000);
                $localStorage.uniqueId = $localStorage.uniqueId || uniqueDate;

              }

              RegisterService.getData($localStorage.uniqueId).then(function(data) {

                if (data.status == 1) {
                  $localStorage.token = data.token;
                  defer.resolve($localStorage.token);
                }
              });

            } else {
              defer.resolve($localStorage.token);
            }
            return defer && defer.promise;
          }
        }
    })
    .state('app.tab.discover.tagged', {
        url: '/tagged',
        views: {
            'tab-discover-tagged': {
                templateUrl: 'js/containers/discover/tagged/tagged-shows.html',
                controller: 'DiscoverTaggedShowsCtrl'
            }
        },
        resolve : {
            token: function ($localStorage, RegisterService, $q) {

                var defer = $q.defer();
                if (!$localStorage.token) {


                    if (typeof device != 'undefined' && device.uuid) {
                        // this is a device
                        $localStorage.uniqueId = $localStorage.uniqueId || device.uuid;

                    } else {
                        // this is your computer
                        uniqueDate = (new Date).getTime() + 'rand' + parseInt(Math.random() * 100000000);
                        $localStorage.uniqueId = $localStorage.uniqueId || uniqueDate;

                    }

                    RegisterService.getData($localStorage.uniqueId).then(function (data) {

                        if (data.status == 1) {
                            $localStorage.token = data.token;
                            defer.resolve($localStorage.token);
                        }
                    });

                } else {
                    defer.resolve($localStorage.token);
                }
                return defer && defer.promise;
            }
        }
    })
    .state('app.tab.discover.editorpicks', {
        url: '/editorpicks',
        views: {
            'tab-discover-editorpicks': {
                templateUrl: 'templates/tab-discover-editorpicks.html',
            }
        }
    })

    .state('app.tab.discover.categories', {
        url: '/categories',
        views: {
            'tab-discover-categories': {
                templateUrl: 'js/containers/discover/category/tab-discover-categories.html',
                controller: 'DiscoverCategoryListCtrl'
            }
        },
        /*resolve: {
          categories: function(DiscoverService, $stateParams){
            return DiscoverService.getCategories();
          }
        }*/
    })
    //#/app/tab/discover/categories/cid
    .state('app.tab.discover.category', {
        url: '/category/:cid',
        views: {
            'tab-discover-categories': {
                templateUrl: 'js/containers/discover/category/tab-discover-category-cid.html',
                controller: 'DiscoverCategoryCtrl'
            }
        },
/*        resolve: {
          category: function(DiscoverService, $stateParams){
            return DiscoverService.getCategory($stateParams.cid);
          }
        } */
    })
/*
    .state('app.tab.player', {
      url: '/player/:pid?mp3&key&title&subTitle',
      views: {
        'tab-player': {
          templateUrl: 'js/containers/player/player.html',
          controller: 'PlayerCtrl'
        }
      },
      resolve: {
        tags: function(TagService, $stateParams) {
          debugger;
          return TagService.getTags($stateParams.key);
        }
      }
    })*/


    .state('app.tab.queue', {
        url: '/queue',
        data: {
          episode: {}
        },
        views: {
            'tab-queue': {
                templateUrl: 'js/containers/queue/tab-queue.html',
                controller: 'QueueCtrl'
            }
        }
    })

    .state('app.tab.podcasts', {
        url: '/podcasts?rss',
        views: {
            'tab-podcasts': {
                templateUrl: 'js/containers/podcasts/tab-podcasts-list.html',
                controller: 'PodcastsCtrl'
            }
        }
    })
      .state('app.tab.podcastsItem', {
        url: '/podcastItem/?rss',
        views: {
          'tab-podcasts': {
            templateUrl: 'js/containers/podcasts/tab-podcasts-item.html',
            controller: 'PodcastsItemCtrl'

          }
        }
      })

    .state('app.tab.profile', {
        url: '/profile',
        views: {
            'tab-profile': {
                templateUrl: 'js/containers/profile/tab-profile.html',
                controller: 'ProfileCtrl'
            }
        }
    });
    $urlRouterProvider.otherwise('/');
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $httpProvider.interceptors.push('ApiInterceptor');

});
