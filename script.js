"use strict";
window.scrollTo(0, 1);

		var torrentClient = new WebTorrent();
		var torrentId = "";
		var playerEle = document.getElementById("player");

if (window.location.protocol != "https:") {window.location.protocol = "https:";}

if (WebTorrent.WEBRTC_SUPPORT) {
  console.log('Web Torrent is supported!');
} else {
  playerEle.innerHTML="Sorry. Web Torrent isn't supported in your browser. ☹️";
}

if (window.applicationCache) {
window.applicationCache.addEventListener('updateready', function(){
		console.log("AppCache: Update found.");
		window.applicationCache.swapCache();
		window.location.reload(true);
}, false);
window.applicationCache.addEventListener('updateready', function(){
		console.log("AppCache: Updating.");
}, false);
window.applicationCache.addEventListener('noupdate', function(){
	console.log("AppCache: No updates."); 
}, false);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

navigator.registerProtocolHandler("web+magnetmusic", "/#%s", "Web Magnet Music");

if(window.location.hash){loadTorrent(location.hash);console.log('Got Web Torrent!');} else { playerEle.innerHTML="No Web Torrent given to load. ☹️"; }

function loadTorrent(urlToLoad) {

torrentId = urlToLoad;

document.documentElement.className=document.documentElement.className.replace("not-loading","loading");

torrentClient.add(torrentId, function (torrent) {
  // Got torrent metadata!
  console.log('Client is downloading:', torrent.infoHash);

  torrent.files.forEach(function (file) {
    // Display the file by appending it to the DOM. Supports video, audio, images, and
    // more. Specify a container element (CSS selector or reference to DOM node).
    file.appendTo('#player');
  });
});

}