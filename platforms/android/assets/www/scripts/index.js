// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

var feeds = [
        { 'url': "http://www.myleo.de/wods.rss" },
        { 'url': "http://www.crossfitmayhem.com/feed/" },
        { 'url': "http://www.crossfitinvictus.com/feed/" },
        { 'url': "http://www.crossfitsolid.se/feed/" },
        //{ 'url': "http://crossfitnyc.com/feed/" },
        //{ 'url': "http://crossfitla.com/feed/" },
];
var index = 0;

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events

        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        $('#mainPage').bind('swipeleft', swipeleft)
        $('#mainPage').bind('swiperight', swiperight)
       
        //var output = '';
        //feeds.forEach(function (feed) {
        //    output += '<li>' + feed.url + '</li>'            
        //});
        //$('ul').append(output).listview('refresh');

        //feeds.forEach(function (feed) {
        //    $('ul').append($('<a/>', {    //here appending `<a>` into `<li>`
        //        'href': 'test.html',
        //        'data-transition': 'slide',
        //        'text': feed.url
        //    }))
        //});

        //onPagecontainershow();
        var feed = getFeedToDisplay();
        displayFeed(feed);


    };



    function displayFeed(feed) {      
        document.getElementById("feedTitle").innerHTML = feed.title;
        var items = feed.xml.getElementsByTagName("item");
        var output = '';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.nodeType == 1) {
                var title = item.getElementsByTagName("title")[0].firstChild.nodeValue;
                var description = item.getElementsByTagName("description")[0].firstChild.nodeValue;
                var link = item.getElementsByTagName("link")[0].firstChild.nodeValue;
                var content = getEncodedContent(item);

                if (content != undefined) {                  
                    output += '<li><pre><a href=' + link + '>' + title + '</a></br>' + content + '</pre></li>'                  
                } else {
                    output += '<li><pre><a href=' + link + '>' + title + '</a></br>' + description + '</pre></li>'
                }
            }
        }
        $('#wodlist').empty().append(output).listview('refresh');
    }

    function getFeedToDisplay() {
        var feed = feeds[index];
        if (feed.xml == undefined) {
            feed.xml = httpGetXml(feed.url);
            feed.title = feed.xml.getElementsByTagName("title")[0].firstChild.nodeValue;
        }
        return feed;
    };

    function swipeleft(event) {
        var tempIndex = index + 1;
        if (tempIndex < feeds.length) {
            index = tempIndex;
            displayFeed(getFeedToDisplay());         
        }
        event.handled = true;
    };

    function swiperight(event) {
        var tempIndex = index - 1;
        if (tempIndex > -1) {
            index = tempIndex;
            displayFeed(getFeedToDisplay());
        }
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

    function ScaleContentToDevice() {
        scroll(0, 0);
        var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
        $(".ui-content").height(content);
    }
})();