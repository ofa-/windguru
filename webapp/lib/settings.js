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

	create_button(target, "language" + '<img id="flag"/><span id="lang"/>',
	function () {
		var controller = lang_controller();
		controller.click();
		controller.update_buttons(_("settings"));
		clear_spots_cache(); // in config.js
	});
	create_button(target, "search", function () {
		location.assign("http://old.windguru.cz/touch/"
			+ lang_controller().get_lang()
			+ "/search.php"
		);
	}); 
	create_button(target, "edit", function () {
		location.replace("menu-edit.html");
	}); 
	create_button(target, "about", function () {
		location.replace("config.html");
	});
	var controller = lang_controller();
	controller.init();
	controller.update_buttons(target);
}

function create_button(e, txt, onclick) {
	e.appendChild(document.createElement("button"));
	e.lastChild.innerHTML = txt;
	e.lastChild.onclick = function (e) { onclick(); e.stopPropagation() };
}

function set_buttons_language(target, lang) {
	var butts = target.getElementsByTagName("button");
	for (var i=0,butt,node,text; butt = butts[i]; i++) {
		if (!butt.i18n_key)
			butt.i18n_key = butt.firstChild.nodeValue;
		node = butt.firstChild;
		text = i18n().get_text(butt.i18n_key, lang);
		butt.replaceChild(document.createTextNode(text), node);
	}
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

	function click() {
		var lang = next_lang(get_lang());
		set_lang(lang);
		localStorage.setItem("windguru.language", lang);
	}

	function init() {
		var lang = localStorage.getItem("windguru.language");
		set_lang(lang ? lang : next_lang());
	}

	function update_buttons(target) {
		set_buttons_language(target, this.get_lang());
	}

	return {
		init:		init,
		get_lang:	get_lang,
		click:		click,
		update_buttons:	update_buttons,
	};
}

function i18n() {
	return {
		language: {
			fr: "Langue : ",
			en: "Language: ",
			cz: "Jazyk: ",
		},
		search: {
			fr: "Chercher un spot",
			en: "Search Spot",
			cz: "Vyhledávání",
		},
		edit: {
			fr: "Éditer les spots",
			en: "Edit Spots",
			cz: "Upravit lokality",
		},
		about: {
			fr: "À propos",
			en: "About",
		},
		version: {
			fr: "Version",
			en: "Version",
		},

		get_text: function (key, lang) {
			var txt = this[key][lang];
			return txt ? txt : this.get_text(key, "en");
		}
	}
}
