function _(id) {
	return document.getElementById(id);
}

function add_spot() {
	_("spot_input").style.display = "block";
	_("controls").style.display = "none";
	_("contents").style.display = "none";
}

function add_menu() {
	var n = document.createElement("div");
	init_menu(n);
	_("contents").appendChild(n);
}

function save_spot() {
	if (!_("spot_name").value || !_("spot_id").value)
		return;
	if (curr_butt) {
		update_butt(curr_butt);
		exit_edit();
	}
	else {
		exit_edit();
		create_new_spot();
	}
}

function exit_edit() {
	_("spot_input").style.display = "";
	_("controls").style.display = "";
	_("contents").style.display = "";
	clear_curr();
}
	
function create_new_spot() {
	var n = document.createElement("input");
	init_button(n);
	update_butt(n);
	_("contents").lastChild.appendChild(n);
	set_curr(n);
	animate_width(n, function () {
	animate_width(n, function () {
	clear_curr();
	})});
}

function save_config() {
	clear_curr();
	save_menu();
	quit_menu_edit();
}

function save_menu() {
	var contents = _("contents");
	remove_empty_menus(contents);
	localStorage.setItem("windguru.menu", contents.innerHTML);
}

function quit_menu_edit() {
	clear_curr();
	location.replace("./");
}

function del_or_quit() {
	if (curr_butt) {
		delete_butt(curr_butt);
		clear_curr();
	}
	else {
		clear_curr();
		quit_menu_edit();
	}
}

function clear_input() {
	_("spot_id")	.value = "";
	_("spot_name")	.value = "";
}

function update_butt(butt) {
	if (!_("spot_name").value || !_("spot_id").value)
		return;
	butt.setAttribute("value",   _("spot_name").value);
	butt.setAttribute("spot",    _("spot_id").value);
}

function delete_butt(butt) {
	if (!butt || butt.is_animating) return;
	animate_width(butt, function () {
	butt.parentNode.removeChild(butt);
	});
}

function clear_curr() {
	if (!curr_butt) return;
	curr_butt.style.background = "";
	curr_butt = null;
	clear_input();
}

function set_curr(butt) {
	clear_curr();
	curr_butt = butt;
	butt.style.background = "lightgreen";
	butt.dbl_click = setTimeout(function() { butt.dbl_click = null }, 500);
	_("spot_id").value = butt.getAttribute("spot");
	_("spot_name").value = butt.value;
}

var curr_butt;

function butt_click(e) {
	var butt = e.target;
	if (butt == curr_butt) {
		if (butt.dbl_click)
			add_spot();
		else
			clear_curr();
	}
	else
	if (curr_butt) {
		move_curr_butt(butt);
	}
	else {
		set_curr(butt);
	}
	e.stopPropagation();
}

function move_curr_butt(dest) {
	var butt = curr_butt;
	if (!butt || butt.is_animating) return;
	dest.blur();
	animate_width(butt, function () {
	swap_butts(butt, dest);
	animate_width(butt, function () {
	clear_curr();
	})});
}

function swap_butts(butt, dest) {
	if (dest == butt.nextSibling)
		dest.parentNode.insertBefore(dest, butt);
	else
		dest.parentNode.insertBefore(butt, dest);
}

function menu_click(e) {
	var butt = curr_butt;
	if (!butt || butt.is_animating) return;
	animate_width(butt, function () {
	e.target.appendChild(butt);
	animate_width(butt, function () {
	clear_curr();
	})});
}

function init_button(butt) {
	butt.onclick = butt_click;
	butt.type = "button";
}

function init_menu(menu) {
	menu.onclick = menu_click;
	for (var i,n=menu.firstChild; n; n=i) {
		i = n.nextSibling;
		if (n.nodeType == Node.TEXT_NODE) {
			n.parentNode.removeChild(n);
		}
	}
}

function animate_width(butt, post_animation_func) {
	butt.is_animating = true;
	if (!butt.original_width) {
		butt.original_width = parseInt(
			document.defaultView.getComputedStyle(butt, "")
			.getPropertyValue("width"));
		xxflate_butt(butt, 100, 0, post_animation_func);
	}
	else {
		xxflate_butt(butt, 0, 100, post_animation_func);
	}
}

function xxflate_butt(butt, from, dest, post_animation_func) {
	butt.style.width = parseInt(butt.original_width*from/100) + "px";
	if (from == dest) {
		if (dest == 100) {
			butt.original_width = null;
			butt.style.width = "";
		}
		butt.is_animating = false;
		post_animation_func();
	}
	else {
		var inc = from > dest ? from - 20 : from + 20;
		setTimeout(function () {
			xxflate_butt(butt, inc, dest, post_animation_func)
		}, 30);
	}
}


function remove_empty_menus(contents) {
	var l = contents.getElementsByTagName("div");
	for (var i=0; i < l.length; i++) {
		if (! l[i].firstChild) {
			l[i].parentNode.removeChild(l[i]);
			i--;
		}
	}
}

function init_content_panel() {
	var contents = _("contents");
	contents.innerHTML = localStorage.getItem("windguru.menu");
	if (!contents.innerHTML) contents.innerHTML = "<div></div>";

	var spots = contents.getElementsByTagName("input");
	for (var i=0; i < spots.length; i++) {
		init_button(spots[i]);
	}
	var menus = contents.getElementsByTagName("div");
	for (var i=0; i < menus.length; i++) {
		init_menu(menus[i]);
	}
}
