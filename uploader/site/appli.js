// requires jquery for a few parts

function _(id) {
	return document.getElementById(id);
}

function rescale() {
	var base_style = window.getComputedStyle(_("loading-blinder"), null);
	var spot_style = window.getComputedStyle(_("container"), null);
	var portrait = (window.orientation % 180 == 0);
	var scale = parseInt(base_style.height)/parseFloat(spot_style.height);
	_("scale").setAttribute("content", "initial-scale="+scale);
}

function cycle_views() {
	set_view(_("workspace").view_state+1);
}

function set_view(state) {
	_("workspace").view_state = state = state % 3;
	switch (state) {
		case 0:
			$("#graph").show();
			$("#forecast").hide();
			break;
		case 1:
			$("td.wgfcst-wgt_legend").hide();
			$("#forecast").show();
			$("#graph").hide();
			break;
		case 2:
			$("td.wgfcst-wgt_legend").show();
			$("#forecast").show();
			$("#graph").hide();
			break;
	}
}

function create_graphic_view() {
	var graph = generate_graph();
	graph.setAttribute("id", "graph");

	var low_temps = graph.select_temp_below(0);
	graph.set_temp_circle_colors(low_temps, "red");
	graph.update_size();
	graph.set_iso0_labels();
}

function generate_graph() {
	var std_view = _("forecast");
	var dest_pos = std_view.parentNode.parentNode;
	_("div_forecast").appendChild(std_view); // save view, graph kills it
	$("#forecast_menu_graph").trigger("click");
	var graph = _("forecast_content_div").firstChild.firstChild;
	dest_pos.appendChild(std_view);
	dest_pos.appendChild(graph);
	dest_pos.removeChild(_("forecast_content_div"));

	graph.set_temp_circle_colors = graph_set_temp_circle_colors;
	graph.update_size = graph_update_size;
	graph.set_iso0_labels = graph_set_iso0_labels;
	graph.select_temp_below = graph_select_temp_below;
	return graph;
}

function graph_set_iso0_labels() {
	var grp = this.getElementsByTagName("g");
	var txt = grp[3].getElementsByTagName("text");
	for (var i=0; i<txt.length; i++) {
		if (txt[i].getAttribute("fill") != "#3344ff")
			break;
		txt[i].firstChild.nodeValue =
			(parseInt(txt[i].firstChild.nodeValue) % 100)/10 + "k";
	}
}

function graph_select_temp_below(temp) {
	var grp = this.getElementsByTagName("g");
	var txt = grp[3].getElementsByTagName("text");
	var ret = [];
	for (var i=txt.length - 1 ;; i--) {
		if (txt[i].getAttribute("fill"))
			break;
		ret.push( parseInt(txt[i].firstChild.nodeValue) <= temp );
	}
	return ret.reverse();
}

function graph_set_temp_circle_colors(selector, color) {
	var grp = this.getElementsByTagName("g");
	var circles = grp[3].getElementsByTagName("circle");
	for (var i in selector) {
		if (selector[i])
			circles[i].setAttribute("stroke", color);
	}
}

function graph_update_size() {
	var graph = this;
	graph_width = parseInt(graph.getAttribute("width")) - 30;
	graph_height = parseInt(graph.getAttribute("height")) - 14;
	graph.setAttribute("width", graph_width);
	graph.setAttribute("height", graph_height);
	graph.setAttribute("viewBox", "0 14 " + graph_width + " " + graph_height);
}

function add_anti_click_and_button() {
	var div = _("container");
	var elt = document.createElement("div");
	elt.setAttribute("id", "anti_click");
	elt.onclick = cycle_views;
	div.appendChild(elt);

	elt = document.createElement("div");
	elt.setAttribute("id", "the_button");
	elt.onclick = function() {
		location.pathname =
		location.pathname.replace(/[^/]*$/, "index.html");
	}
	div.appendChild(elt);
}

function has_low_temp(data) {
	for (var i in data.TMPE)
		if (data.TMPE[i] < 5)
			return true;
	return false;
}

function update_spot_info(data) {
	data.spot = data.spot.replace(/^[a-zA-Z]* - /, "").replace(/ \| .*$/, "");
	data.nickname =
		"<img id=sun_img src=sun.png /><a class=info_txt> " +
		data.sunrise + " - " + data.sunset + " " +
		" | alt: " + data.alt + "m </a>";
}

function update_view_opts(opts) {
	opts.params = ["WINDSPD","GUST","SMER","TMPE","CDC","APCPs"];
	if (location.search.match("long")) {
		opts.fhours = 180;
		opts.wrap = 80;
	}
	else {
		opts.fhours = 140;
		opts.wrap = 40;
	}
	opts.fhours += 3;
}

function build_forecast(glob) {
	update_spot_info(glob.data);
	update_view_opts(glob.opts);
	document.title = glob.data.spot;
	glob.opts.lang = glob.lang;

	var data = glob.data.fcst[glob.data.id_model];
	data.RH  = null; // removes info from graphic view
	data.SLP = [];   // removes info from graphic view

	var show_iso0 = has_low_temp(data);
	if (show_iso0) {
		// use SLP to show iso0 in graphic view - see update_iso0_labels()
		for (var i in data.FLHGT)
			data.SLP.push(data.FLHGT[i]/100+1000);
		glob.opts.params.push("FLHGT");
	}
	WgFcst.showForecast(glob.data, glob.opts, "forecast", false);
}

function install_loading_indicator() {
	var div = _("loading-blinder");
	var elt = document.createElement("center");
	var txt = location.pathname.replace(/.*\//, "").replace(/\..*/, "");
	if (location.search.match("name="))
		txt = decodeURIComponent(location.search).replace(/.*name=/, "");
	elt.innerHTML = txt;
	div.appendChild(elt);
	elt = create_spinner();
	div.appendChild(elt);
}

function init() {
	add_anti_click_and_button();
	create_graphic_view();
	set_view(0);
	rescale();
	$("body").css("overflow", "auto");
	$("#loading-blinder").hide();
}
