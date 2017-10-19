// https://github.com/webtorrent/bittorrent-dht

var DHT = require('bittorrent-dht')
var _ = require('lodash')
var geoip = require('geoip-lite-country');

var crawl = function (infoHash, callback){

	var peers = []

	var dht = new DHT()

	dht.listen(20000, function () {
	  console.log('now listening')
	})

	dht.on('peer', function (peer, infoHash, from) {
	  console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
	  
	  var geo = geoip.lookup(peer.host);
	  
	  peers.push(peer.host + ':' + peer.port + ':' + geo.country)
	})

	setTimeout(function () {
		dht.destroy()
		
		console.log('Done crawling');

		console.log('Found ' + _.uniq(peers).length + ' peers');

		callback(_.uniq(peers));
	  }, 10 * 1000);

	dht.lookup(infoHash)
}

var someInfoHash = '96BFF9E1F47398C3807071B55AD658ED50F2042F' //Cité de la peur https://thehiddenbay.info/torrent/4168931/La_citA__de_la_Peur_by_LADB

crawl(someInfoHash, function(peers){
	console.log(peers);
	console.log('Crawl ended')
})

