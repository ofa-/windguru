function create_settings_button(dest) {
	dest.appendChild(document.createElement("div"));
	dest.lastChild.id = "settings_button";
	dest.lastChild.innerHTML = "<img src='img/settings.png'>";
	dest.lastChild.onclick = show_settings;
	dest.lastChild.ontouchstart = function () {};
}

function show_settings(e) {
	_("settings").style.display = "";
	_("settings_button").style.display = "none";
	document.onclick = hide_settings;
	e.stopPropagation();
}

function hide_settings() {
	_("settings").style.display = "none";
	_("settings_button").style.display = "block";
	document.onclick = null;
}

function create_settings_dialog(target) {
	target.id = "settings";
	target.style.display = "none";
	target.appendChild(document.createElement("div"));
	target = target.lastChild;
	target.appendChild(document.createElement("div"));
	target = target.lastChild;

	create_button(target, 'Language: <img id="flag"/><span id="lang"/>');
	lang_controller().setup(target.lastChild);

	create_button(target, "Search Spot", function (e) {
		location.assign("http://www.windguru.cz/touch/"
			+ lang_controller().get_lang()
			+ "/search.php"
		);
	}); 
	create_button(target, "Edit Spots", function (e) {
		location.replace("menu-edit.html");
	}); 
	create_button(target, "About", function (e) {
		location.replace("config.html");
	});
}

function create_button(e, txt, onclick) {
	e.appendChild(document.createElement("button"));
	e.lastChild.innerHTML = txt;
	e.lastChild.onclick = function (e) { onclick(); e.stopPropagation() };
}

function lang_controller() {
	var langs = list_languages().split(", "); // list_languages: config.js
	var disp = document.getElementById("lang");
	var flag = document.getElementById("flag");

	function set_lang(lang) {
		disp.innerHTML = lang;
		flag.src = "http://www.windguru.cz/img/flags/" + lang + ".png";
	}

	function get_lang() {
		return disp.innerHTML;
	}
	
	function next_lang(lang) {
		var i;
		for (i=0; i<langs.length; i++) {
			if (lang == langs[i]) {
				break;
			}
		}
		return langs[(i+1)%langs.length];
	}

	function lang_onclick(e) {
		var lang = next_lang(get_lang());
		set_lang(lang);
		localStorage.setItem("windguru.language", lang);
		e.stopPropagation();
	}

	function init() {
		var lang = localStorage.getItem("windguru.language");
		set_lang(lang ? lang : next_lang());
	}

	function setup(elt) {
		init();
		elt.onclick = lang_onclick;
	}

	return { setup: setup, init: init, get_lang: get_lang };
}
