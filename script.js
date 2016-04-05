"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

		var torrentClient = new WebTorrent();
		var torrentId = "";
		var playerEle = document.getElementById("player");
		var playlist = "";

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

if (Modernizr.datachannel) { /* if (WebTorrent.WEBRTC_SUPPORT) { */
  console.log('Web Torrent is supported!');
  if(window.location.hash){ loadTorrent(location.hash.split('#')[1]); console.log('Got Web Torrent!'); } else { playerEle.innerHTML="No Web Torrent given to load. ☹️. <br/><a href='/WebTorrentClient/#magnet:?xt=urn:btih:b260fa9dc51093bd20d31ca9ccfa3c3abf157a13&dn=art_of_war_librivox&tr=http%3A%2F%2Fbt1.archive.org%3A6969%2Fannounce&tr=http%3A%2F%2Fbt2.archive.org%3A6969%2Fannounce&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=http%3A%2F%2Fia600508.us.archive.org%2F19%2Fitems%2F&ws=http%3A%2F%2Fia700508.us.archive.org%2F19%2Fitems%2F&ws=https%3A%2F%2Farchive.org%2Fdownload%2F' target='_blank'>Try an audiobook of the Art of War by Sun Tzu (Translated by Lionel Giles. Read by Moira Fogarty.)</a>."; }
  
  document.getElementById('seeding').addEventListener("change", function(){
  	if(document.getElementById('seeding').checked) {
	    if(window.localStorage){localStorage.setItem('seeding', 'true');}
	} else {
	    if(window.localStorage){localStorage.setItem('seeding', 'false');}
	}
  });
  
  if (window.localStorage && localStorage.getItem("seeding") === null) {
    document.getElementById('seeding').checked="true";
	if(window.localStorage){localStorage.setItem('seeding', 'true');}
  } else {
    if (window.localStorage && localStorage.getItem("seeding") === "true") {
      document.getElementById('seeding').checked="true";
    } else if (window.localStorage && localStorage.getItem("seeding") === "false") {
      document.getElementById('seeding').removeAttribute("checked");
    }
  }
  
} else {
  console.log('No Web Torrent support.');
  if(window.location.hash){
  playerEle.innerHTML="Sorry. Web Torrent isn't supported in your browser. ☹️<br/><br/><a href='" + location.hash.split('#')[1] + "'>Try downloading this in your BitTorrent client</a>.<br/><sub>If you don't have one, try <a href='http://webtorrent.io/desktop/' target='_blank'>WebTorrent Desktop</a>, <a href='http://www.utorrent.com/' target='_blank'>µTorrent</a> or <a href='https://www.transmissionbt.com/' target='_blank'>Transmission</a></sub> <br/>Or <a href='http://www.bitlet.org?torrent=" + location.hash.split('#')[1] + "' target='_blank'>Try downloading this from BitLet.org</a>."; } else { playerEle.innerHTML="Sorry. Web Torrent isn't supported in your browser. ☹️<br/><br/>Also there was no Web Torrent given to load.<br/>" }
  document.getElementById('seeding').setAttribute("disabled","disabled");
}

function loadTorrent(urlToLoad) {

torrentId = urlToLoad;

document.documentElement.className=document.documentElement.className.replace("not-loading","loading");

playerEle.innerHTML="<img id='loading' src='logo.png' srcset='logo.svg' alt='loading' title='loading'/><br/>";

/* Start download */
torrentClient.add(torrentId, function (torrent) {
  // Got torrent metadata!
  console.log('Client is downloading:', torrent.infoHash);
  
  document.title = "Web Torrent Player [" + torrent.infoHash + "]";
  
  document.getElementById("info").innerHTML+="<sub>"+torrent.infoHash + "</sub><br/><br/><sub>" + torrent.magnetURI + "</sub><br/>";
  
/* Remove #loading when first file is displayed */
torrent.files[0].getBlobURL(function (err, url) {
	  if (err) { throw err }
	  if(document.getElementById('loading')!=null){
	  document.getElementById("player").removeChild(document.getElementById("loading"));
	  }
});

 torrent.files.forEach(function (file) {
 
  file.getBlobURL(function (err, url) {
    if (err) { throw err }
	  
      if (file.path === 'cover.png' || file.path === 'cover.jpg' || file.path === 'cover.PNG' || file.path === 'cover.jpeg') {
        file = torrent.files[i];
        console.log("Torrent: [" + torrent.infoHash + "] has a cover!");

	  document.body.style.backgroundImage = "url('" + url + "')";

      } else if (file.path === 'playlist.m3u' || file.path === 'playlist.m3u8') {
	  file = torrent.files[i];
        console.log("Torrent: [" + torrent.infoHash + "] has a playlist!");

        var playlist = M3U.parse(url);
		console.log("Playlist: " + playlist);
	  
	  
	  } else if (file.path.endsWith('.mp3')) {
    
    var audio = document.createElement('audio');
    audio.src = url;
    audio.controls = "true";
    audio.className = "player";
    playerEle.appendChild(audio);
    
    var a = document.createElement('a');
    a.download = file.name;
    a.href = url;
    a.textContent = 'Download ' + file.name;
    a.className = "button download-link";
    playerEle.appendChild(a);
	
	} else {
    
    var a = document.createElement('a');
    a.download = file.name;
    a.href = url;
    a.textContent = 'Download ' + file.name;
    a.className = "button download-link";
    playerEle.appendChild(a);
	}
	
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
  document.getElementById("progress").textContent=torrent.progress;
  document.getElementById("progress").value=torrent.progress;
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

navigator.registerProtocolHandler("web+magnet", "/#magnet:%s", "Web Magnet");