function list_languages() {
	var langs_key = "windguru.languages";
	var languages = localStorage.getItem(langs_key);
	if (languages) return languages;

	try {
		languages = get_fresh_list_languages();
		localStorage.setItem(langs_key, languages);
	} catch (e) {
		languages = "fr, en";
	}
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


function get_version() {
	var ver_key = "windguru.version";
	var version = localStorage.getItem(ver_key);
	if (version) return version;

	try {
		version = get_fresh_version();
		localStorage.setItem(ver_key, version);
	} catch (e) {
		version = "--";
	}
	return version;
}

function get_fresh_version() {
	var req = new XMLHttpRequest();
	req.open("GET", "version", false);
	req.send(null);
	return req.responseText;
}

function init_config() {
	var target = document.createElement("div");
	target.id = "config";
	target.onclick = function(e) { location.replace("./index.html") };

	var e = document.createElement("center");
	e.innerHTML =	  location.hostname + "<br>"
			+ location.pathname.replace(/[^\/]*$/, "");
	e.onclick = function (e) {
		e.stopPropagation();
		if (!clear_local_storage())
			return;
		e.target.lastChild.nodeValue = "CLEARED";
		setTimeout(function () { location.reload(); }, 1000);
	}
	target.appendChild(e);
	e = document.createElement("div");
	e.innerHTML = 	  "<span>version</span>" + get_version()
			+ '<tt id="up"></tt><br>'
			+ "<span>languages</span>" + list_languages()
			+ "<br>";
	target.appendChild(e);
	document.body.appendChild(target);
	document.getElementById("up").progress = 0;

	applicationCache.addEventListener('updateready', update_ready, false);
	applicationCache.addEventListener('progress', update_progress, false);
}

function update_progress() {
	var elt = document.getElementById("up");
	elt.innerHTML = " (up) " + ".oO0Oo"[elt.progress++ % 6];
}

var ver_key = "windguru.version";
function update_ready() {
	localStorage.removeItem(ver_key);
	applicationCache.swapCache();
	location.reload();
}

function clear_local_storage() {
	if (localStorage.length > 3) {
		var menu_key = "windguru.menu";
		var menu_sav = localStorage.getItem(menu_key);
		localStorage.clear();
		localStorage.setItem(menu_key, menu_sav);
		return true;
	}
	if (confirm("Reset menu ?")) {
		localStorage.clear();
		return true;
	}
	return false;
}
