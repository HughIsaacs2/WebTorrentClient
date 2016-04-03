"use strict";
window.scrollTo(0, 1);

		var torrentClient = new WebTorrent();
		var torrentId = "";
		var playerEle = document.getElementById("player");

if (window.location.protocol != "https:") {window.location.protocol = "https:";}

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

if (WebTorrent.WEBRTC_SUPPORT) {
  console.log('Web Torrent is supported!');
  if(window.location.hash){ loadTorrent(location.hash); console.log('Got Web Torrent!'); } else { playerEle.innerHTML="No Web Torrent given to load. ☹️. <br/><a href='/#magnet:?xt=urn:btih:b260fa9dc51093bd20d31ca9ccfa3c3abf157a13&dn=art_of_war_librivox&tr=http%3A%2F%2Fbt1.archive.org%3A6969%2Fannounce&tr=http%3A%2F%2Fbt2.archive.org%3A6969%2Fannounce&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=http%3A%2F%2Fia600508.us.archive.org%2F19%2Fitems%2F&ws=http%3A%2F%2Fia700508.us.archive.org%2F19%2Fitems%2F&ws=https%3A%2F%2Farchive.org%2Fdownload%2F'>Try an audiobook of the Art of War by Sun Tzu (Translated by Lionel Giles. Read by Moira Fogarty.)</a>."; }
} else {
  playerEle.innerHTML="Sorry. Web Torrent isn't supported in your browser. ☹️";
}

function loadTorrent(urlToLoad) {

torrentId = urlToLoad;

document.documentElement.className=document.documentElement.className.replace("not-loading","loading");

playerEle.innerHTML="<img id='loading' src='logo.png' srcset='logo.svg' alt='loading' title='loading'/>";

/* Start download */
torrentClient.add(torrentId, function (torrent) {
  // Got torrent metadata!
  console.log('Client is downloading:', torrent.infoHash);

 torrent.files.forEach(function (file) {
 
  file.getBlobURL(function (err, url) {
    if (err) { throw err }
    
	playerEle.innerHTML="";
	
    var audio = document.createElement('audio');
    audio.src = url;
    audio.controls = "true";
    audio.className == "player";
    playerEle.appendChild(audio);
    
    var a = document.createElement('a');
    a.download = file.name;
    a.href = url;
    a.textContent = 'Download ' + file.name;
    a.className == "button download-link";
    playerEle.appendChild(a);
  });
	
 });

/* Display download status */
torrent.on('download', function(chunkSize){
  /* console.log('chunk size: ' + chunkSize);
  console.log('total downloaded: ' + torrent.downloaded);
  console.log('download speed: ' + torrent.downloadSpeed);
  console.log('progress: ' + torrent.progress);
  console.log('======');
  */
  document.getElementById("log").innerHTML='chunk size: ' + chunkSize + '<br/>' + 'total downloaded: ' + torrent.downloaded + '<br/>' + 'download speed: ' + torrent.downloadSpeed + '<br/>' + 'progress: ' + torrent.progress + '<br/>' + '<hr/>' + '======';
});

/* Torrent finished event */
torrent.on('done', function(){
  console.log('Web Torrent finished downloading');
  
    document.documentElement.className=document.documentElement.className.replace("loading","not-loading");
    
	if(document.getElementById('seeding').checked) {
	
	}
  
  torrent.files.forEach(function(file){
  
  });
});
  
});

}