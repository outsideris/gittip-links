/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
(function() {
  // specify current site
  var site = '';
  if (location.host === "github.com") {
    site = "github";
  } else if (location.host === "bitbucket.org") {
    site = "bitbucket";
  }

  var gittipIconImg = '<img src="' + chrome.extension.getURL("/images/icon_016.png") +
                      '" style="margin-left: 3px; vertical-align: middle;">';

  var findUsers = function() {
    var users = _.filter($('a'), function(anchor) {
      if ($(anchor).attr('href')) {
        var matched = $(anchor).attr('href').match(/^\/(\w+)$/);
        if (matched && matched[1] === $(anchor).text()) {
          return true;
        }
        if (matched && site === "bitbucket") {
          if (matched[1] !== 'support' && matched[1] !== 'plans' &&
              $(anchor).text() === 'View profile') {
            return true;
          }
        }
      }
      return false;
    });

    return users;
  };

  var checkOnGittip = function(url, callback) {
    $.ajax({
      type: 'HEAD',
      async: true,
      url: url,
      success: function() {
        callback(true);
      },
      error: function() {
        callback(false);
      }
    });
  };

  var insertGittipIcon = function(users) {
    _.forEach(users, function(user) {
      var userName = $(user).attr('href').match(/^\/(\w+)$/)[1];
      checkOnGittip('https://www.gittip.com/on/' + site + '/' + userName + '/', function(exist) {
        if (exist) {
          var gittipLink = $('<a href="http://www.gittip.com/on/' + site + '/' + userName +
                             '/" target="_blank">' + gittipIconImg +'</a>');
          gittipLink.insertAfter(user);
        }
      });
    });
  };

  var users = findUsers();
  insertGittipIcon(users);
})();
