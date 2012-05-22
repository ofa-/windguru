function create_settings_dialog(target) {
	var txt = {
		network: "Network :",
		language: "Language :",
		config: "Config",
		clear: "Clear",
		search: "Search",
		spots: "Spots",
	};

	var e = document.createElement("ul");
	target.appendChild(e);
	create_li_entry(e, txt.network, get_network_status_txt());
	create_li_entry(e, txt.language, '<img id="flag"/><span id="lang"/>');
	lang_controller().setup(e.lastChild);
	e.onclick = function (e) { e.stopPropagation(); };

	var b=document.createElement("div");
	target.appendChild(b);
	create_button(b, txt.config, function (e) {
		location.replace("config.html");
		e.stopPropagation();
	});
	create_button(b, txt.clear, function (e) {
		clear_local_storage();
		lang_controller().init();
		e.stopPropagation();
	}); 
	create_button(b, txt.search, function (e) {
		location.replace("http://www.windguru.cz/touch/int/search.php");
		e.stopPropagation();
	}); 
	create_button(b, txt.spots, function (e) {
		location.replace("menu-edit.html");
		e.stopPropagation();
	}); 
}

function create_li_entry(e, title, value) {
	e.appendChild(document.createElement("li"));
	e.lastChild.innerHTML = title;
	e.lastChild.appendChild(document.createElement("span"));
	e.lastChild.lastChild.innerHTML = value;
}

function create_button(e, title, onclick) {
	e.appendChild(document.createElement("input"));
	e.lastChild.type = "button";
	e.lastChild.value = title;
	e.lastChild.onclick = onclick;
}

function get_network_status_txt() {
	var txt="<img src='img/";
	txt += navigator.onLine ? "ok.png" : "no.png";
	txt += "'/>";
	return txt;
}

function clear_local_storage() {
	if (localStorage.length > 1) {
		var menu_key = "windguru.menu";
		var menu_sav = localStorage.getItem(menu_key);
		localStorage.clear();
		localStorage.setItem(menu_key, menu_sav);
	}
	else {
		if (confirm("Spots already cleared. Reset menu ?")) {
			localStorage.clear();
			location.reload();
		}
	}
}

function lang_controller() {
	var langs = list_languages().split(", ");
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
