function create_settings_dialog(target) {
	var txt = {
		network: "Network :",
		language: "Language :",
		config: "Config",
		clear: "Clear",
	};

	var e = document.createElement("ul");
	target.appendChild(e);
	create_li_entry(e, txt.network, get_network_status_txt());
	create_li_entry(e, txt.language, '<img id="flag"/><span id="lang"/>');
	setup_lang_control();
	e.onclick = function(e) {
		e.stopPropagation();
	}
	e.clear = function() {
		this.children[0].lastChild.innerHTML = "";
		this.children[1].lastChild.innerHTML = "";
	}

	var b=document.createElement("div");
	target.appendChild(b);
	create_button(b, txt.config, function (e) {
		location.replace("config.html");
		e.stopPropagation();
	});
	create_button(b, txt.clear, function (e) {
		localStorage.clear();
		this.parentNode.previousSibling.clear();
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

function setup_lang_control() {
	var langs = list_languages().split(", ");

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
	e.parentNode.parentNode.onclick = lang_onclick;
}
