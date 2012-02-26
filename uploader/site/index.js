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
	window.location = this.getAttribute("page") + "?name=" + this.value;
}

function get_spots_menu() {
	var req = new XMLHttpRequest();
	req.open("GET", "menu.xml", false);
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

function create_status_line() {
	var dest = document.body;
	dest.appendChild(document.createElement("span"));
	dest.lastChild.id = "status_line";
	update_status_line();
	document.addEventListener("online", update_status_line);
	document.addEventListener("offline", update_status_line);
}

function update_status_line() {
	var txt = get_status();
	document.getElementById("status_line").innerHTML = txt;
}

function index_page() {
	create_menu();
	create_loading_blinder();
	//create_status_line();
}

function init() {
	if (location.search) {
		var what = location.search.replace(/\/?$/,"");
		if (what != "?")
			location.replace(what.substring(1)+".html");
	}
	else
	if (spot = localStorage.getItem("windguru.preferred_spot")) {
		location.replace(spot);
	}
	index_page();
}
