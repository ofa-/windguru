function list_languages() {
	var langs_key = "windguru.languages";
	var langs = localStorage.getItem(langs_key);
	if (langs) return langs;

	langs = get_fresh_list_languages();
	localStorage.setItem(langs_key, langs);
	return langs;
}

function get_fresh_list_languages() {
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

function get_site() {
	return location.hostname + location.pathname.replace(/[^\/]*$/, "");
}

function get_version() {
	var ver_key = "windguru.version";
	var version = localStorage.getItem(ver_key);
	if (version) return version;

	version = get_fresh_version();
	localStorage.setItem(ver_key, version);
	return version;
}

function get_fresh_version() {
	var req = new XMLHttpRequest();
	req.open("GET", "manifest.php", false);
	req.send(null);
	var lines = req.responseText.split("\n");
	return lines[1].replace(/# Version: /, "");
}

function init_config() {
	var d = document.createElement("div");
	d.onclick = function() { location.replace("./") };
	var s = d.style;
	s.position = "absolute";
	s.top = s.left = "0";
	s.width = s.height = "100%";
	s.zIndex = "-1";
	document.body.appendChild(d);
}

function clear_local_storage() {
	if (localStorage.length > 1) {
		var menu_key = "windguru.menu";
		var menu_sav = localStorage.getItem(menu_key);
		localStorage.clear();
		localStorage.setItem(menu_key, menu_sav);
	}
	else {
		if (confirm("Spots already cleared.\nReset menu ?")) {
			localStorage.clear();
			location.reload();
		}
	}
}

function update_app() {
	applicationCache.update();
}
