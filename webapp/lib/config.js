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

	applicationCache.addEventListener('progress', update_progress, false);
	applicationCache.addEventListener('downloading', poll_status, false);
}

function poll_status() { // event 'updateready' does not fire on FF (2012-05)
	setInterval(function() {
		switch (applicationCache.status) {
			case applicationCache.IDLE:
			case applicationCache.UPDATEREADY:
				update_ready();
		}
	}, 1000);
}

function update_progress() {
	var elt = document.getElementById("up");
	elt.innerHTML = " (up) " + ".oO0Oo"[elt.progress++ % 6];
}

function update_ready() {
	var ver_key = "windguru.version";
	localStorage.removeItem(ver_key);
        var langs_key = "windguru.languages";
        localStorage.removeItem(langs_key);
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

function clear_spots_cache() {
	for (var k in localStorage) {
		if (k.indexOf("windguru.last_update.") == 0) {
			localStorage.removeItem(k);
		}
	}
}
