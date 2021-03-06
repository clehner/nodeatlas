var loc1;
var loc2;

function initDistance() {
	map.on('popupopen', onDistanceClick);
	$('#distance').removeClass('dis');
	$('#distance').css('background-color', 'rgba(0, 0, 0, 1)');
	$('#distance').css('background-image', 'url(/res/img/ruler_white.png)');
}

function onDistanceClick(e) {
	var loc = e.popup._source.getLatLng();
	e.popup._close();
	var popup = L.popup();
	popup.setLatLng(loc);
	popup.setContent('You have already picked this node.');
	if (typeof loc1 == 'undefined') {
		loc1 = loc;
	} else if (loc == loc1) {
		popup.addTo(map);
	} else if (typeof loc2 == 'undefined') {
		map.removeLayer(popup);
		loc2 = loc;
		map.off('popupopen', onDistanceClick);
		$('#distance').css('background-color', 'rgba(255, 255, 255, .8)');
		$('#distance').css('background-image', 'url(/res/img/ruler.png)');
		$('#distance').addClass('dis');
		findDistance(loc1, loc2);
		loc1 = undefined;
		loc2 = undefined;
	} 
}

function drawLine(points, distance, center) {
	var line = new L.Polyline(points, {
		color: '#000',
		weight: 8,
		opacity: 0.5,
		smoothFactor: 1
	});
	
	var popup = L.popup();
	popup.setLatLng(line.getBounds().getCenter());
	popup.setContent(distance+' km<br/>'+distance.toMiles()+' miles');
	
	line.on('click', function() {
		map.removeLayer(this);
		map.removeLayer(popup);
	});
	
	line.on('mouseover', function() {
		popup.addTo(map);
	});
	
	line.on('contextmenu', onPath);
	
	line.addTo(map);
}

function findDistance(loc1, loc2) {	
	var lat1 = loc1.lat;
	var lat2 = loc2.lat;
	var lon1 = loc1.lng;
	var lon2 = loc2.lng;
		
	var R = 6371; // km
	var dLat = (lat2-lat1).toRad();
	var dLon = (lon2-lon1).toRad();
	lat1 = lat1.toRad();
	lat2 = lat2.toRad();
		
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	drawLine([loc1, loc2], parseFloat(d.toFixed(2)));
}

Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}

Number.prototype.toMiles = function() {
	return parseFloat((this/1.60934).toFixed(2));
}