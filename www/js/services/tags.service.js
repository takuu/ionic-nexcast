angular.module('nexcast.tags.service', []).service('TagService', getTagAPI);
getTagAPI.$inject = ["$http", "$q", "$sce"];
function getTagAPI($http, $q, $sce) {
  var url = API_URL + 'tags/';
  var Promise = $q;
  return {
    getTags: _getTags
  };

  function _updateFilter(name, value) {
    value = value || "";
    url = helper.updateQueryString(url, name, value);
  }

  function _getTags(id) {
    return new Promise(function (resolve, reject) {
      // var json = {"status":1,"result":[{"cards_sid":123,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:04:00","content":"some text ....asd","button1_text":"","button1_link":"","image_location":"http:\/\/nexcast.co\/users\/media\/123\/123.jpg","status":1,"created_at":"2016-06-14 06:10:49","updated_at":"2016-06-14 06:10:49","seconds":240},{"cards_sid":124,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:09:00","content":"test","button1_text":"","button1_link":"","image_location":"","status":0,"created_at":"2016-06-14 06:13:14","updated_at":"2016-06-14 06:13:14","seconds":540},{"cards_sid":133,"podcast_sid":22,"podcast_key":null,"podcast_rssurl":null,"episode_key":"157e390c508bced2c48322ad95be211f","media_location":"http:\/\/feedproxy.google.com\/~r\/NeverNotFunny\/~5\/uLoa2vz_5i8\/268208108-nevernotfunny-episode-1817-diedrich-bader.mp3","time":"00:11:00","content":"asdfadsff","button1_text":"","button1_link":"","image_location":"http:\/\/nexcast.co\/users\/media\/133\/133.jpg","status":1,"created_at":"2016-06-15 06:06:54","updated_at":"2016-06-15 06:06:54","seconds":660}]};
      $http.get(url + id, {cache: true})
        .success(function (data) {
          var json = (typeof data === 'string') ? JSON.parse(data): data;
          var result = _.map(json.result, function(tag) {
            tag.formattedContent = linkify((tag.content || '').replace(/(\r\n|\n|\r)/gm, "<br>"));
            // tag.formattedContent = $sce.trustAsResourceUrl(linkify((tag.content || '').replace(/(\r\n|\n|\r)/gm, "<br>")));
            var embeddedLink = (tag.youtube_location || '').replace('youtu.be', 'www.youtube.com/embed');
            embeddedLink = (embeddedLink || '').replace('www.youtube.com/watch?v=', 'www.youtube.com/embed/');
            embeddedLink = embeddedLink.replace('https', 'http');
            tag.video_location = $sce.trustAsResourceUrl(embeddedLink);
            // scope.currentTag.video_location = $sce.trustAsResourceUrl('https://www.youtube.com/embed/qVMW_1aZXRk');
            return tag;
          });
          resolve(_.sortBy(result, 'seconds'));
        })
        .error(function (err) { reject('update ' + name + ' failed: ' + err); });
    });
  }
};