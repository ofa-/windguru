function menu_toggle_page(e) {
	var div = this.getElementsByTagName("div");
	for (var i=0; i<div.length; i++) {
		if (div[i].style.display == "none")
			continue;
		div[(i+1) % div.length].style.display = "block";
		div[i].style.display = "none";
		break;
	}
	e.stopPropagation();
}

function input_load_page(e) {
	var menu = document.getElementById("menu");
	var load = document.getElementById("loading-blinder");
	load.firstChild.innerHTML = this.value;
	load.style.display = "table-cell";
	menu.style.display = "none";
	e.stopPropagation();
	var spot = this.getAttribute("spot");
	var page = spot ? "spot.html?" + spot : this.getAttribute("page");
	window.location = page;
}

function get_spots_menu() {
	var req = new XMLHttpRequest();
	req.open("GET", "defaults/menu.xml", false);
	req.send(null);
	return req.responseText;
}

function create_menu() {
	document.body.innerHTML = get_spots_menu();
	var menu = document.getElementById("menu");
	if (! menu) {
		document.body.innerHTML = "<form>failed to load menu.xml</form>";
		return;
	}
	var butt = menu.getElementsByTagName("input");
	for (var i=0; i<butt.length; i++) {
		butt[i].type = "button";
		butt[i].onclick = input_load_page;
	}
	menu.onclick = menu_toggle_page;
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
	dest.lastChild.innerHTML = "i"; // "img/settings.png";
	dest.lastChild.onclick = show_settings;

	dest.appendChild(document.createElement("div"));
	dest.lastChild.id = "settings";
	dest.lastChild.onclick = hide_settings;
	create_settings_dialog(dest.lastChild);
}

function show_settings() {
	document.getElementById("menu").style.display = "none";
	document.getElementById("settings").style.display = "table-cell";
}

function hide_settings() {
	document.getElementById("menu").style.display = "table-cell";
	document.getElementById("settings").style.display = "none";
}

function init_index() {
console.log(location.search);
	if (location.search) {
	}
	else
	if (spot = localStorage.getItem("windguru.preferred_spot")) {
		location.replace(spot);
	}
	create_menu();
	create_loading_blinder();
	create_settings();
}