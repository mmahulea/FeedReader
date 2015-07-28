// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

var feeds = [
        { 'url': "http://www.myleo.de/wods.rss" },
        { 'url': "http://www.crossfitmitte.de/en/feed/" },
        //{ 'url': "http://www.crossfit.com/index1.xml" },
        { 'url': "http://crossfitweightlifting.com/feed/" },
        { 'url': "http://crossfitnyc.com/feed/" },
        { 'url': "http://crossfitla.com/feed/" },
];
var index = 0;

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        document.addEventListener("deviceready", function () {
            $('#mainPage').bind('swipeleft', swipeleft); //show next hides screen1, shows screen2 
            $('#mainPage').bind('swiperight', swiperight);//show prev hides screen2, shows screen1
        }, false);
      
        var feed = getFeedToDisplay();
        displayFeed(feed);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.      
    };

    function displayFeed(feed) {
        document.getElementById("content").innerHTML = "";
        document.getElementById("feedTitle").innerHTML = feed.title;
        var items = feed.xml.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.nodeType == 1) {
                var title = item.getElementsByTagName("title")[0].firstChild.nodeValue;
                var description = item.getElementsByTagName("description")[0].firstChild.nodeValue;
                var content = getEncodedContent(item);

                if (content != undefined) {
                    document.getElementById("content").innerHTML += content;
                    document.getElementById("content").innerHTML += "<hr/>";
                } else {
                    document.getElementById("content").innerHTML += title;
                    document.getElementById("content").innerHTML += "<br>";
                    document.getElementById("content").innerHTML += description;
                    document.getElementById("content").innerHTML += "<br>";
                    document.getElementById("content").innerHTML += "<hr/>";
                }
            }
        }
    }

    function getFeedToDisplay() {
        var feed = feeds[index];
        if (feed.xml == undefined) {
            feed.xml = httpGetXml(feed.url);
            feed.title = feed.xml.getElementsByTagName("title")[0].firstChild.nodeValue;
            var text = httpGetText(feed.url);
        }
        return feed;
    };

    function swipeleft(event) {
        index += 1;
        displayFeed(getFeedToDisplay());
        event.handled = true;
    };

    function swiperight(event) {
        index -= 1;
        displayFeed(getFeedToDisplay());
        event.handled = true;
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function getEncodedContent(item) {
        var elements = item.getElementsByTagNameNS("http://purl.org/rss/1.0/modules/content/", "encoded");
        if (elements != undefined && elements[0] != undefined) {
            return elements[0].firstChild.nodeValue;
        }
        return undefined;
    }

    function httpGetXml(url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        var text = xmlHttp.responseText;
        text = (new window.DOMParser()).parseFromString(text, "text/xml");
        return text;
    }

    function httpGetText(url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        var text = xmlHttp.responseText;
        return text;
    }
})();