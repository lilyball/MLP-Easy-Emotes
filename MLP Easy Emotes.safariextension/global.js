var defaults = {
  "togglerOffset": 19,
  "panelWidth": 130,
  "panelHeight": 250
};

function calculatePreferences() {
  var prefs = {
    useMRP: safari.extension.settings.bundleMyRedditPonies,
    mouseOutEnabled: safari.extension.settings.autoCloseEmoteList,
    zIndex: (safari.extension.settings.makeVisibleAlways ? 9999 : 99),
    lineOffset: parseInt(safari.extension.settings.togglerOffset),
    width: parseInt(safari.extension.settings.panelWidth),
    height: parseInt(safari.extension.settings.panelHeight),
    ignoreLogin: safari.extension.settings.allInternet || safari.extension.settings.synchtube
  };
  return prefs;
}

function inject() {
  safari.extension.removeContentScripts();
  safari.extension.addContentScriptFromURL(safari.extension.baseURI + "userscript.js", whitelist(), [], true);
}

function reloadPrefs() {
  var prefs = calculatePreferences();
  var windows = safari.application.browserWindows;
  for (var i = 0; i < windows.length; i++) {
    var tabs = windows[i].tabs;
    for (var j = 0; j < tabs.length; j++) {
      var tab = tabs[j];
      if (tab.page !== void 0) {
        tab.page.dispatchMessage("preferences", prefs);
      }
    }
  }
}

var subredditTemplate = "http://*.reddit.com/r/%s/comments/*";
var messagingPattern = "http://*.reddit.com/message/*";
var userPagePattern = "http://*.reddit.com/user/*";
var defaultSubreddits = [
  "mylittlepony",
  "clopclop",
  "mylittlenosleep",
  "mylittlerepost",
  "MLPdrawingschool",
  "parasprites",
  "mylittlerage",
  "ainbowdash",
  "idliketobeatree",
  "mylittleWTF",
  "Fluttershy",
  "Applejack",
  "ponypapers",
  "MLPtunes",
  "newlunarrepublic",
  "mylittleponyproblems",
  "mylittle3dpony",
  "educationalponies",
  "mylittleportals",
  "mylittlefortress",
  "mylittlefanfic",
  "mylittleminecraft"
];
var allInternetPatterns = ["http://*", "https://*"];
var synchtubePatterns = ["http://*.synchtube.com/r/RedditBronies", "http://*.synchtube.com/r/RedditBronies#"];
function whitelist() {
  var results = [];
  if (safari.extension.settings.showInAllSubreddits) {
    results.push(subredditTemplate.replace("%s", "*"));
  } else {
    for (var i = 0; i < defaultSubreddits.length; i++) {
      var subreddit = defaultSubreddits[i];
      results.push(subredditTemplate.replace("%s", subreddit));
    }
  }
  if (safari.extension.settings.showInMessagingCenter) {
    results.push(messagingPattern);
  }
  if (safari.extension.settings.bundleMyRedditPonies) {
    // also run on user pages if we're bundling My Reddit Ponies
    results.push(userPagePattern);
  }
  if (safari.extension.settings.allInternet) {
    for (var i = 0; i < allInternetPatterns; i++) {
      results.push(allInternetPatterns[i]);
    }
  }
  if (safari.extension.settings.synchtube) {
    for (var i = 0; i < synchtubePatterns; i++) {
      results.push(synchtubePatterns[i]);
    }
  }
  return results;
}

safari.extension.settings.addEventListener("change", function(event) {
  switch (event.key) {
    case "showInAllSubreddits":
    case "showInMessagingCenter":
    case "bundleMyRedditPonies":
    case "allInternet":
    case "synchtube":
      inject();
      break;
    case "togglerOffset":
    case "panelWidth":
    case "panelHeight":
      var val = parseInt(safari.extension.settings[event.key]);
      if (isNaN(val)) {
        safari.extension.settings[event.key] = defaults[event.key].toString();
        break;
      } else if (val.toString() !== safari.extension.settings[event.key]) {
        safari.extension.settings = val.toString();
      }
    default:
      reloadPrefs();
      break;
  }
}, false);

safari.application.addEventListener("message", function(event) {
  if (event.name === "getPreferences") {
    var prefs = calculatePreferences();
    event.target.page.dispatchMessage("preferences", prefs);
  }
}, false);

inject();
