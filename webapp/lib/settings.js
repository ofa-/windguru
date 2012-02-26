function create_settings_dialog(target) {
	var txt = {
		spot: "Spot :",
		view: "View :",
		network: "Network :",
		language: "Language :",
		config: "Config",
		clear: "Clear",
	};

	var e = document.createElement("ul");
	target.appendChild(e);
	e.appendChild(document.createElement("li"));
	e.lastChild.innerHTML = txt.spot + get_preferred_spot_txt();
	e.appendChild(document.createElement("li"));
	e.lastChild.innerHTML = txt.view + get_preferred_view_txt();
	e.appendChild(document.createElement("li"));
	e.lastChild.innerHTML = txt.network + get_network_status_txt();
	e.appendChild(document.createElement("li"));
	e.lastChild.innerHTML = txt.language;
	e.lastChild.appendChild(document.createElement("img"));
	e.lastChild.lastChild.id = "flag";
	e.lastChild.appendChild(document.createElement("span"));
	e.lastChild.lastChild.id = "lang";
	setup_lang_control();
	e.appendChild(document.createElement("input"));
	e.lastChild.type = "button";
	e.lastChild.value = txt.config;
	e.lastChild.onclick = function () { location.replace("config.html") };
	e.appendChild(document.createElement("input"));
	e.lastChild.type = "button";
	e.lastChild.value = txt.clear;
	e.lastChild.onclick = function () { localStorage.setItem('windguru.last_update', '') }; 

	return e;
}

function get_preferred_spot_txt() {
	var txt = localStorage.getItem("windguru.preferred_spot");
        txt = txt ? txt.replace(/.*name=/, "").replace(/\|.*/, "") : "";
        txt = decodeURIComponent(txt);
	return txt;
}

function get_preferred_view_txt() {
	var txt = ["Graph", "Table", "Table + Legend"];
	var id = localStorage.getItem("windguru.preferred_view");
	return (id ? txt[id] : "");
}

function get_network_status_txt() {
	var txt="<img src='img/";
	txt += navigator.onLine ? "ok.png" : "no.png";
	txt += "'/>";
	return txt;
}

function setup_lang_control() {
	var langs = [ "en", "fr", "cz" ];

	function set_flag() {
		var e = document.getElementById("lang");
		var i = document.getElementById("flag");
		var l = e.innerHTML;
		i.src = "http://www.windguru.cz/img/flags/"+l+".png";
	}
	
	function lang_onclick(event) {
		var elt = document.getElementById("lang");
		var lang = elt.innerHTML;
		var i;
		for (i=0; i<langs.length; i++) {
			if (lang == langs[i]) {
				break;
			}
		}
		var prev = lang;
		lang = elt.innerHTML = langs[(i+1)%langs.length];
		set_flag();
		localStorage.setItem("windguru.language", lang);
		if (! get_lang()) {
			localStorage.setItem("windguru.language", prev);
			elt.innerHTML = "failed !";
			setTimeout(function () { elt.innerHTML = prev; set_flag(); }, 1000);
		}
		event.stopPropagation();
	}

	var e = document.getElementById("lang");
	e.innerHTML = get_lang().langdir.dir;
	set_flag();
	e.parentNode.onclick = lang_onclick;
}
