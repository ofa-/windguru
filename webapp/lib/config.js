function list_languages() {
	var langs_key = "windguru.languages";
	var languages = localStorage.getItem(langs_key);
	if (languages) return languages;

	languages = get_fresh_list_languages();
	localStorage.setItem(langs_key, languages);
	return languages;
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
	document.getElementById("config").onclick = function(e) {
		if (e.target.id == "config")
			location.replace("./index.html")
	};
	applicationCache.addEventListener('updateready', update_ready, false);
	applicationCache.addEventListener('noupdate', no_update, false);
	applicationCache.addEventListener('downloading', update_app, false);
	applicationCache.addEventListener('progress', update_app, false);
}

function clear_local_storage() {
	if (localStorage.length > 3) {
		var menu_key = "windguru.menu";
		var menu_sav = localStorage.getItem(menu_key);
		localStorage.clear();
		localStorage.setItem(menu_key, menu_sav);
		location.reload();
	}
	else {
		if (confirm("Spots already cleared.\nReset menu ?")) {
			localStorage.clear();
			location.reload();
		}
	}
}

var ver_key = "windguru.version";
function update_app() {
	var version = localStorage.getItem(ver_key);
	if (version.match(/\(up\)$/)) return;

	localStorage.setItem(ver_key, version + " (up)");
	applicationCache.update();
	location.reload();
}

function update_ready() {
	localStorage.removeItem(ver_key);
	location.reload();
}

function no_update() {
	var version = localStorage.getItem(ver_key);
	if (version.match(/\(up\)$/))
		update_ready();
}
