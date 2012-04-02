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
	set_view(_("container").view_state + 1);
}

function set_view(state) {
	_("container").view_state = state = state % 3;
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
	var w = parseInt(this.getAttribute("width")) - 30;
	var h = parseInt(this.getAttribute("height")) - 14;
	this.setAttribute("width", w);
	this.setAttribute("height", h);
	this.setAttribute("viewBox", "0 14 " + w + " " + h);
}

function graph_set_methods() {
	this.select_temp_below		= graph_select_temp_below;
	this.set_temp_circle_colors	= graph_set_temp_circle_colors;
	this.update_size		= graph_update_size;
	this.set_iso0_labels		= graph_set_iso0_labels;
}

function get_page_name_and_opts() {
	return location.href.replace(/.*\//, "");
}

function go_home() {
	location.replace("./?_");
}

function add_anti_click_and_buttons() {
	var div = _("div_forecast").firstChild.firstChild;
	var elt = document.createElement("div");
	elt.setAttribute("id", "anti_click");
	elt.onclick = cycle_views;
	div.appendChild(elt);
	elt = document.createElement("div");
	elt.setAttribute("id", "home_button");
	elt.onclick = go_home;
	elt.ontouchstart = function() {}
	elt.ontouchend   = function() {}
	div.appendChild(elt);
	elt = document.createElement("div");
	elt.setAttribute("id", "me_default_button");
	elt.onclick = me_default_onclick;
	elt.ontouchstart = function() {}
	elt.ontouchend   = function() {}
	if (localStorage.getItem("windguru.preferred_spot")
	    === get_page_name_and_opts())
		elt.setAttribute("class", "is_default_spot");
	else
		elt.setAttribute("class", "not_default_spot");
	div.appendChild(elt);
}

function me_default_onclick() {
	if (this.getAttribute("class") == "is_default_spot") {
		localStorage.setItem("windguru.preferred_spot", "");
		this.setAttribute("class", "not_default_spot");
	}
	else {
		localStorage.setItem("windguru.preferred_spot",
					get_page_name_and_opts());
		localStorage.setItem("windguru.preferred_view",
					_("container").view_state);
		this.setAttribute("class", "is_default_spot");
	}
}

function update_spot_info(data) {
	data.spot = data.spot.replace(/^[a-zA-Z]* - /, "").replace(/ \| .*$/, "");
	data.nickname = "<a class=info_txt> " +
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

function update_params(params) {
	update_spot_info(params.data);
	update_view_opts(params.opts);
	params.opts.lang = params.lang;
}

function has_low_temp(data) {
	for (var i in data.TMPE)
		if (data.TMPE[i] < 5)
			return true;
	return false;
}

function set_temps_display(params) {
	var data = params.data.fcst[params.data.id_model];
	data.RH  = null; // removes info from graphic view
	data.SLP = [];   // removes info from graphic view

	var show_iso0 = has_low_temp(data);
	if (show_iso0) {
		// use SLP to show iso0 in graphic view
		// see graph_update_iso0_labels()
		for (var i in data.FLHGT)
			data.SLP.push(data.FLHGT[i]/100+1000);
		params.opts.params.push("FLHGT");
	}
}

function move_view_up_in_tree(depth) {
	var div = _("forecast_content_div");
	var dest = div.parentNode;
	var view = div;
	while (depth--)
		view = view.firstChild;
	dest.appendChild(view);
	dest.removeChild(div);
	return view;
}

function build_std_view(params) {
	build_forecast(params, 1);
	move_view_up_in_tree(1);
}

function build_graph_view(params) {
	build_forecast(params, 2);
	var graph = move_view_up_in_tree(2);
	graph.setAttribute("id", "graph");
	graph_set_methods.call(graph);

	var low_temps = graph.select_temp_below(0);
	graph.set_temp_circle_colors(low_temps, "red");
	graph.update_size();
	graph.set_iso0_labels();
}

function build_forecast(params, tab) {
	// WgFcst.showForecast(data, opts, <param 3>, <param 4>);
	// returns: data (first param)
	// param 3: index given to forecats object in global var "forecasts"
	// param 4: false => write to doc, string:"<element id>" => insert into elt
	// opts.vt: 1 => build table view (tab 1), 2 => build graph (tab 2)
	params.opts.vt = tab;
	WgFcst.showForecast(params.data, params.opts, "forecast", "div_forecast");
}

function install_loading_indicator() {
	var div = _("loading-blinder");
	var elt = document.createElement("center");
	var txt;
	if (location.search.match("name="))
		txt = decodeURIComponent(location.search).replace(/.*name=/, "");
	else
		txt = "Loading";
	elt.innerHTML = txt;
	div.appendChild(elt);
	elt = create_spinner();
	div.appendChild(elt);
}

function populate_container() {
	var e = _("container");
	e.appendChild(document.createElement("center"));
	e.lastChild.appendChild(document.createElement("div"));
	e.lastChild.lastChild.id = "div_forecast";
}

function compact_views() {
	_("forecast").parentNode.appendChild(_("graph"));
	var div = _("div_forecast");
	div.removeChild(div.lastChild);
}

var t0;
function init0() {
	install_loading_indicator();
	t0 = new Date().getTime();
}

function init1() {
	document.body.innerHTML = "load time: " + (new Date().getTime() - t0);
}

function get_var(uri, cached_value) {
	if (navigator.onLine && !cached_value)
	try {
		var req = new XMLHttpRequest();
		req.open("GET", uri, false);
		req.send(null);
		var c = req.responseText;
		var v = do_eval(c);
		v.throw_if_null;
		localStorage.setItem("windguru."+uri, c);
		return v;
	}
	catch (e) {
	}
	var c = localStorage.getItem("windguru."+uri);
	return do_eval(c);
}

function do_eval(c) {
	var v = null;
	try {
		eval(c.replace(/var [^=]*=/, "v="));
	}
	catch (e) {}
	return v;
}

function get_lang() {
	var lang = localStorage.getItem("windguru.language");
	if (!lang)
		return get_var("defaults/lang.js");

	var lang_uri = "data.php?," + lang + ",WgLang";
	var ret = get_var(lang_uri, true);
	if (ret)
		return ret;
	ret = get_var(lang_uri);
	if (ret)
		return ret;
	ret = get_var("defaults/lang.js");
	localStorage.setItem("windguru.language", "");
	return ret;
}

function get_params() {
	var q_spot_id = location.search.replace(/,.*/,"");
	var spot_data = "data.php" + q_spot_id + ",int,.*data_1";
	return {
		data: get_var(spot_data),
		opts: get_var("defaults/opts.js"),
		lang: WgLang // global var, required by scripts.min.js
	};
}

function display_error(txt) {
	_("loading-blinder").innerHTML = "<center>"+txt+"</center>";
	_("loading-blinder").onclick = go_home;
}

function build_from_cache() {
	var last = localStorage.getItem("windguru.last_update");
	if ( !last || (new Date().getTime() - last > 6*60*60*1000) )
		return false;
	document.getElementById("container").innerHTML =
		 localStorage.getItem("windguru.cached_view");
	remove("home_button");
	remove("me_default_button");
	remove("anti_click");
	add_anti_click_and_buttons();
	return true;
}

function remove(id) {
	var e = document.getElementById(id);
	e.parentNode.removeChild(e);
}

function build_fresh() {
	var params = get_params();
	if (!params.data) {
		return false;
	}
	update_params(params);
	document.title = params.data.spot;
	populate_container();
	set_temps_display(params);
	build_std_view(params);
	build_graph_view(params);
	compact_views();
	add_anti_click_and_buttons();
	return true;
}

function init() {
	if (! build_from_cache()) {
		if (! build_fresh()) {
			display_error("No data");
			return;
		}
		localStorage.setItem("windguru.last_update", new Date().getTime());
		localStorage.setItem("windguru.cached_view",
				document.getElementById("container").innerHTML);
	}

	var view = localStorage.getItem("windguru.preferred_view");
	set_view(view ? view : 0);
	//rescale();
	$("body").css("overflow", "auto");
	$("#loading-blinder").hide();
}
