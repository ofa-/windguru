function _(id) {
	return document.getElementById(id);
}

function input_load_page(e) {
	var butt = this;
	e.stopPropagation();

	_("contents").style.display = "none";
	_("settings_button").style.display = "none";
	_("loading-blinder").firstChild.innerHTML = butt.value;
	_("loading-blinder").style.display = "table";
	var spot_specs = butt.getAttribute("spot") + "|" + butt.value;
	location.replace("spot.html?" + spot_specs);
}

function page_scroll_to_next(e) {
	var div = e.target.parentNode;
	var contents = _("contents");
	if (contents.scrollTop != div.offsetTop) {
		contents.scrollTop = div.offsetTop;
	}
	else {
		div = div.nextSibling;
		contents.scrollTop = div ? div.offsetTop : 0;
	}
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

function create_menu(dest) {
	var menu = document.createElement("div");
	menu.innerHTML = get_spots_menu();
	var butt = menu.getElementsByTagName("input");
	for (var i=0; i<butt.length; i++) {
		butt[i].type = "button";
		butt[i].onclick = input_load_page;
	}
	var list = menu.getElementsByTagName("page");
	for (var page; page = list[0]; ) {
		page.onclick = page_scroll_to_next;
		dest.appendChild(document.createElement("div"));
		dest.lastChild.appendChild(page);
	}
}

function create_loading_blinder(dest) {
	dest.appendChild(document.createElement("div"));
	dest.lastChild.id = "loading-blinder";
	dest.lastChild.appendChild(document.createElement("center"));
	dest.lastChild.appendChild(create_spinner());
}

function create_settings(dest) {
	dest.appendChild(document.createElement("div"));
	create_settings_dialog(dest.lastChild);
	create_settings_button(document.body);
}

function set_contents_height() {
	var height = window.innerHeight;
	_("contents").style.height = height + "px";

	var padding = navigator.userAgent.match(/iPhone/) ? 0 : 20;
	var list = document.getElementsByTagName("page");
	for (var i=0; i < list.length; i++)
		list[i].parentNode.style.height = (height - padding) + "px";
}

function init_index() {
	document.body.innerHTML = "<div id='contents'></div>";
	create_menu(_("contents"));
	create_loading_blinder(document.body);
	create_settings(document.body);
	set_contents_height();
	window.onresize = set_contents_height;
}
