function _(id) {
	return document.getElementById(id);
}

function toggle_menu_page(e) {
	var div = _("menu").getElementsByTagName("div");
	for (var i=0; i<div.length; i++) {
		if (div[i].style.display == "none")
			continue;
		div[(i+1) % div.length].style.display = "block";
		div[i].style.display = "none";
		break;
	}
}

function input_load_page(e) {
	var menu = _("menu");
	var load = _("loading-blinder");
	load.firstChild.innerHTML = this.value;
	load.style.display = "table-cell";
	menu.style.display = "none";
	e.stopPropagation();
	var spot = this.getAttribute("spot");
	location.replace("spot.html?" + spot + "|" + this.value);
}

function get_spots_menu() {
	var menu = localStorage.getItem("windguru.menu");
	if (menu) return menu;

	var req = new XMLHttpRequest();
	req.open("GET", "defaults/menu.xml", false);
	req.send(null);
	menu = req.responseText;
	localStorage.setItem("windguru.menu", menu);
	return menu;
}

function create_menu() {
	document.body.innerHTML = get_spots_menu();
	var menu = _("menu");
	if (! menu) {
		document.body.innerHTML = "Failed to load menu";
		return;
	}
	var butt = menu.getElementsByTagName("input");
	for (var i=0; i<butt.length; i++) {
		butt[i].type = "button";
		butt[i].onclick = input_load_page;
	}
	document.onclick = toggle_menu_page;
}

function create_loading_blinder() {
	document.body.appendChild(document.createElement("div"));
	document.body.lastChild.id = "loading-blinder";
	document.body.lastChild.appendChild(document.createElement("center"));
	document.body.lastChild.appendChild(create_spinner());
}

function create_settings() {
	var dest = document.body;
	dest.appendChild(document.createElement("span"));
	dest.lastChild.id = "settings_button";
	dest.lastChild.innerHTML = "<span>Settings</span>";
	dest.lastChild.onclick = show_settings;
	dest.lastChild.ontouchstart = function () {};
	dest.lastChild.ontouchend   = function () {};

	dest.appendChild(document.createElement("div"));
	dest.lastChild.id = "settings";
	create_settings_dialog(dest.lastChild);
}

function show_settings(e) {
	_("menu").style.display = "none";
	_("settings").style.display = "table-cell";
	_("settings_button").style.display = "none";
	document.onclick = hide_settings;
	e.stopPropagation();
}

function hide_settings() {
	_("menu").style.display = "table-cell";
	_("settings").style.display = "none";
	_("settings_button").style.display = "";
	document.onclick = toggle_menu_page;
}

function init_index() {
	create_menu();
	create_loading_blinder();
	create_settings();
}
