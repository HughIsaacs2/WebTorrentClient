"use strict";
window.scrollTo(0, 1);

		var torrentClient = new WebTorrent();
		var torrentId = "";

if (window.location.protocol != "https:") {window.location.protocol == "https:";}
		
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

navigator.registerProtocolHandler("web+magnet", "/#%s", "Web Magnet");

if(window.location.hash){torrentId = location.hash;}

function loadtorrent(urlToLoad) {

torrentId = urlToLoad;

document.documentElement.className=document.documentElement.className.replace("not-loading","loading");

client.add(torrentId, function (torrent) {
  // Got torrent metadata!
  console.log('Client is downloading:', torrent.infoHash);

  torrent.files.forEach(function (file) {
    // Display the file by appending it to the DOM. Supports video, audio, images, and
    // more. Specify a container element (CSS selector or reference to DOM node).
    file.appendTo('#player');
  });
});

}

addressbar.onkeydown = function(){if (event.keyCode == 13) {loadtorrent(addressbar.value);}}
document.getElementById('load').addEventListener('click', function(){ loadtorrent(addressbar.value); },false);

browser.addEventListener("message", function(){});