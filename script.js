"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

		var torrentClient = new WebTorrent();
		var torrentId = "";
		var fileList = document.getElementById("files");
		var playlist = [];

if (window.location.protocol == "http:") {window.location.protocol = "https:";}

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

if (Modernizr.datachannel) { /* if (WebTorrent.WEBRTC_SUPPORT) { */
  console.log('Web Torrent is supported!');
  document.getElementById('seeding').removeAttribute("disabled");
  if(window.location.hash){ loadTorrent(location.hash.split('#')[1]); console.log('Got Web Torrent!'); } else {
fileList.innerHTML="No Web Torrent given to load. 😞<br/><a href='/#magnet:?xt=urn:btih:a88fda5954e89178c372716a6a78b8180ed4dad3&dn=The+WIRED+CD+-+Rip.+Sample.+Mash.+Share&tr=udp%3A%2F%2Fexodus.desync.com%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F' target='_blank'>Try 'The WIRED CD'</a>."; }
  
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
  fileList.innerHTML="Sorry. Web Torrent isn't supported in your browser. 😞<br/><br/><a href='" + location.hash.split('#')[1] + "'>Try downloading this in your BitTorrent client</a>.<br/><sub>If you don't have one, try <a href='http://webtorrent.io/desktop/' target='_blank'>WebTorrent Desktop</a>.</sub> <br/>Or <a href='http://www.bitlet.org?torrent=" + location.hash.split('#')[1] + "' target='_blank'>Try downloading this from BitLet.org</a>."; } else { fileList.innerHTML="Sorry. Web Torrent isn't supported in your browser. ??<br/><br/>Also there was no Web Torrent given to load.<br/>" }
  document.getElementById('seeding').setAttribute("disabled","disabled");
}

function loadTorrent(urlToLoad) {

torrentId = urlToLoad;

document.documentElement.className=document.documentElement.className.replace("not-loading","loading");

fileList.innerHTML="<img id='loading' src='logo.png' srcset='logo.svg' alt='loading' title='loading' aria-busy='true'/><br/>";

/* Start download */
torrentClient.add(torrentId, {announce:["wss://tracker.btorrent.xyz", "wss://tracker.fastcast.nz", "wss://tracker.openwebtorrent.com"]}, function (torrent) {
  // Got torrent metadata!
  console.log('Client is downloading:', torrent.infoHash);
  
  document.title = "Web Torrent Player [" + torrent.infoHash + "]";
  
  document.getElementById("torrent-info").innerHTML+="<sub>"+torrent.infoHash + "</sub><br/><br/>";
  
  document.getElementById("magnet-link").href=torrent.magnetURI;
  document.getElementById("magnet-link").textContent=torrent.magnetURI;
  document.getElementById("magnet-link").removeAttribute('hidden');
  
  document.getElementById("embed-code").textContent="<iframe src=\""+ location.origin + "/#" + torrent.infoHash +"\" width=\"300\" height=\"380\" frameborder=\"0\" scrolling=\"no\" allowtransparency=\"true\" lazyload=\"1\" loading=\"lazy\" importance=\"low\" allowfullscreen=\"true\" sandbox=\"allow-scripts allow-forms allow-popups allow-presentation\" allow=\"speaker; picture-in-picture; animations; fullscreen; encrypted-media; unsized-media 'none'; geolocation 'none'; midi 'none'; payment 'none'; accelerometer 'none'; vr 'none'; camera 'none'; magnetometer 'none'; usb 'none'; ambient-light-sensor 'none'; gyroscope 'none'; microphone 'none'; document-write 'none'; vertical-scroll 'none';\"></iframe>";
  
  document.getElementById("embed-code").addEventListener("click", function(){
	  document.getElementById("embed-code").focus();
	  document.getElementById("embed-code").select();
  });
  
  document.getElementById("embed-code").addEventListener("focus", function(){
	  document.getElementById("embed-code").focus();
	  document.getElementById("embed-code").select();
  });
  
  document.getElementById("embed-code").removeAttribute('hidden');
  
/* Remove #loading when first file is displayed */
torrent.files[0].getBlobURL(function (err, url) {
	  if (err) { throw err }
	  if(document.getElementById('loading')!=null){
	  document.getElementById("files").removeChild(document.getElementById("loading"));
	  }
});

 torrent.files.forEach(function (file) {
 
  file.getBlobURL(function (err, url) {
    if (err) { throw err }
	/*
	var audio = document.createElement('audio');
    audio.src = url;
    audio.controls = "true";
    audio.className = "player";
    fileList.appendChild(audio);
    
    var a = document.createElement('a');
    a.download = file.name;
    a.href = url;
    a.textContent = 'Download ' + file.name;
    a.className = "button download-link";
    fileList.appendChild(a);
	*/
	  
      if (file.name === 'cover.png' || file.name === 'cover.jpg' || file.name === 'cover.jpeg' || file.name === 'cover.gif' || file.name === 'poster.jpg' || file.name === 'poster.jpeg') {
        console.log("Torrent: [" + torrent.infoHash + "] has a cover!");

	  document.getElementById("main").style.backgroundImage = "linear-gradient(150deg, #1c688c 1%, rgba(0, 0, 0, 0.75) 10%, rgba(0, 0, 0, 0.5) 80%), url('" + url + "')";
	  
	  var a = document.createElement('a');
	  a.download = file.name;
	  a.href = url;
	  a.textContent = 'Download ' + file.name;
	  a.className = "button download-link";
	  fileList.appendChild(a);

      } else if (file.name === 'playlist.m3u' || file.name === 'playlist.m3u8') {
        console.log("Torrent: [" + torrent.infoHash + "] has a playlist!");

        //var playlist = M3U.parse(url);
		//console.log("Playlist: " + JSON.stringify(playlist));
		
		var a = document.createElement('a');
		a.download = file.name;
		a.href = url;
		a.textContent = 'Download ' + file.name;
		a.className = "button download-link";
		fileList.appendChild(a);
	  
	  } else if (file.name.endsWith(".mp3") || file.name.endsWith(".m4a") || file.name.endsWith(".aac") || file.name.endsWith(".ogg")) {
		  
	playlist.push(file.name);
	playlist.sort();
	console.log(playlist);
    
    var audio = document.createElement('audio');
    audio.src = url;
    audio.controls = "true";
    audio.className = "player";
    fileList.appendChild(audio);
    
    var a = document.createElement('a');
    a.download = file.name;
    a.href = url;
    a.textContent = 'Download ' + file.name;
    a.className = "button download-link";
    fileList.appendChild(a);
	
	} else if (file.name.endsWith(".png")  || file.name.endsWith(".webp") || file.name.endsWith(".gif") || file.name.endsWith(".jpg") || file.name.endsWith(".jpeg") || file.name.endsWith(".svg") || file.name.endsWith(".ico") || file.name.endsWith(".apng")) {
	
	var imgBox = document.createElement('img');
	imgBox.src = url;
	imgBox.title = file.name;
	imgBox.setAttribute("width","200px");
	imgBox.setAttribute("height","auto");
    imgBox.className = "image-box";
	fileList.appendChild(imgBox);
	
    var a = document.createElement('a');
    a.download = file.name;
    a.href = url;
    a.textContent = 'Download ' + file.name;
    a.className = "button download-link";
    fileList.appendChild(a);	
		
	} else {
    
    var a = document.createElement('a');
    a.download = file.name;
    a.href = url;
    a.textContent = 'Download ' + file.name;
    a.className = "button download-link";
    fileList.appendChild(a);
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
  document.getElementById("log").innerHTML='chunk size: ' + chunkSize + '<br/>' + 'total downloaded: ' + torrent.downloaded + '<br/>' + 'total uploaded: ' + torrent.uploaded + '<br/>' + 'download speed: ' + torrent.downloadSpeed + '<br/>' + 'upload speed: ' + torrent.uploadSpeed + '<br/>' + 'progress: ' + torrent.progress + '<br/>' + 'peers: ' + torrent.numPeers + '<br/>' + 'path: ' + torrent.path + '<br/>';
  document.getElementById("progress").textContent=torrent.progress;
  document.getElementById("progress").title=torrent.progress;
  document.getElementById("progress").value=torrent.progress;
});

/* When peer connected */
torrent.on('wire', function (wire, addr) {
  console.log('connected to peer with address ' + addr);
});

/* Torrent finished event */
torrent.on('done', function(){
  console.log('Web Torrent finished downloading');
  
    document.documentElement.className=document.documentElement.className.replace("loading","not-loading");
    
	if(document.getElementById('seeding').checked) {
	
	torrentClient.seed(torrent.files, function (torrent) {
    console.log('Client is seeding ' + torrent.magnetURI);
	});
	
	}
  
  torrent.files.forEach(function(file){
  
  });
});
  
});

}

navigator.registerProtocolHandler("web+magnet", "/#magnet:%s", "Web Magnet");

if ('mediaSession' in navigator) {

  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'WebTorrent Player',
    artist: 'WTPlay',
    album: 'WTPlay',
    artwork: [
      { src: 'logo.png', sizes: '228x228', type: 'image/png' },
      { src: 'logo.svg', sizes: 'any', type: 'image/svg' }
    ]
  });

  navigator.mediaSession.setActionHandler('play', function() {});
  navigator.mediaSession.setActionHandler('pause', function() {});
  navigator.mediaSession.setActionHandler('seekbackward', function() {});
  navigator.mediaSession.setActionHandler('seekforward', function() {});
  navigator.mediaSession.setActionHandler('previoustrack', function() {});
  navigator.mediaSession.setActionHandler('nexttrack', function() {});
}

if (window.isSecureContext && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
  
  // Listen for claiming of our ServiceWorker
  navigator.serviceWorker.addEventListener('controllerchange', function(event) {
  // Listen for changes in the state of our ServiceWorker
    navigator.serviceWorker.controller.addEventListener('statechange', function() {
    // If the ServiceWorker becomes "activated", let the user know they can go offline!
      if (this.state === 'activated') {
      // Reload like you would with AppCache
      window.location.reload(true);
      }
    });
  });

}

if (window.isSecureContext && 'serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(function(reg) {
    return reg.sync.register('refreshCache');
	console.log("Background sync registered.");
  }).catch(function() {
    // system was unable to register for a sync,
    // this could be an OS-level restriction
    console.log("Couldn't register for background sync.");
  });
} else {
  // serviceworker/sync not supported
  console.log("Background sync not supported.");
}