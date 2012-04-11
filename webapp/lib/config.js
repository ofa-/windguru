function list_options() {
}

function list_spots() {
	var req = new XMLHttpRequest();
	req.open("GET", "defaults/menu.xml", false);
	req.send(null);
	var spots = req.responseXML.getElementsByTagName("input");
	var ret = "";
	for (var i=0; i<spots.length; i++) {
		var spot_id   = spots[i].getAttribute("spot");
		var spot_name = spots[i].getAttribute("value");
		if (! spot_id)
			continue;
		ret += spot_name + "(" + spot_id + "), ";
	}
	document.write( ret.replace(/, $/, "") );
}

function list_languages() {
	var req = new XMLHttpRequest();
	req.open("GET", "manifest.extra", false);
	req.send(null);
	var lines = req.responseText.split("\n");
	var ret = "";
	for (var i in lines) {
		var line = lines[i];
		if (  line.match(/^#/))
			continue;
		if (! line.match(/flags\/[a-z]*\.png$/))
			continue;
		var lang = line.replace(/.*flags\//, "").replace(".png", "");
		ret += lang + ", ";
	}
	return ret.replace(/, $/, "");
}
