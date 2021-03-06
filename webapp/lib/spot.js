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
			show("graph", true);
			show("forecast", false);
			break;
		case 1:
			show_legend(false);
			show("forecast", true);
			show("graph", false);
			break;
		case 2:
			show_legend(true);
			show("forecast", true);
			show("graph", false);
			break;
	}
}

function show_legend(show) {
	var l = document.getElementsByClassName("wgfcst-wgt_legend");
	for (var i=0; i<l.length; i++)
		l[i].style.display = show ? "" : "none"; 
}

function show(id, show) {
	_(id).style.display = show ? "" : "none";
	_(id).style.visibility = show ? "visible" : "hidden";
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
	for (var i=txt.length - 1 ; i>=0; i--) {
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

function go_home() {
	location.replace("./index.html");
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
	div.appendChild(elt);
}

function update_spot_info(data, spot_name) {
	data.nickname = "<a class=info_txt> " +
		data.sunrise + " - " + data.sunset + " " +
		" | alt: " + data.alt + "m </a>";
	data.spot = spot_name;
}

function update_view_opts(opts, long_view) {
	opts.params = ["WINDSPD","GUST","SMER","TMPE","CDC","APCPs"];
	opts.fhours = 140;
	opts.wrap = 40;
	if (long_view) {
		opts.fhours = 180;
		opts.wrap = 80;
	}
	opts.fhours += 3;
}

function update_params(params, spot_name) {
	update_spot_info(params.data, spot_name.replace(/ \(long\)$/, ""));
	update_view_opts(params.opts, spot_name.match  (/ \(long\)$/));
	params.opts.lang = params.lang;
	params.WgFcst = load_scripts(params.lang);
}

function has_high_flhgt(data) {
	return Math.min.apply(Math, data.FLHGT) > 3000;
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
	var data = params.data.fcst[params.data.id_model];
	if (has_high_flhgt(data)) {
		data.FLHGT = null;
	}
	build_forecast(params, 1);
	move_view_up_in_tree(1);
}

function build_graph_view(params) {
	var data = params.data.fcst[params.data.id_model];
	data.RH  = null; // removes info from graphic view
	data.SLP = null; // removes info from graphic view

	if (data.FLHGT) {
		// use SLP to show iso0 in graphic views
		// (see graph_set_iso0_labels())
		data.SLP = [];
		for (var i in data.FLHGT)
			data.SLP.push(data.FLHGT[i]/100+1000);
		}

	build_forecast(params, 2);
	var graph = move_view_up_in_tree(2);
	graph.setAttribute("id", "graph");
	graph_set_methods.call(graph);

	var low_temps = graph.select_temp_below(0);
	graph.set_temp_circle_colors(low_temps, "red");
	if (data.FLHGT) graph.set_iso0_labels();
	graph.update_size();
}

function build_forecast(params, tab) {
	/* 
	   WgFcst.showForecast(data, opts, <param 3>, <param 4>)
	   returns: data (first param)
	   param 3: index given to forecats object in global var "forecasts"
	   param 4: false                  => write to doc,
	            string:"<element id>"  => insert into elt
	   opts.vt: 1 => build table view (tab 1),
	            2 => build graph (tab 2)
	*/
	params.opts.vt = tab;
	params.WgFcst.showForecast(params.data, params.opts, "forecast", "div_forecast");
}

function install_loading_indicator(txt) {
	var div = _("loading-blinder");
	var elt = document.createElement("center");
	document.title = txt;
	div.style.display = "table";
	elt.innerHTML = txt ? txt : "Loading";
	div.appendChild(elt);
	elt = create_spinner();
	div.appendChild(elt);
	document.body.style.overflow = "hidden";
	document.ontouchmove = function (e) { e.preventDefault() };
}

function hide_loading_indicator() {
	document.body.style.overflow = "auto";
	document.ontouchmove = null;
	_("loading-blinder").style.display = "none";
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

function get_var(uri) {
	var v = null;
	try {
		var req = new XMLHttpRequest();
		req.open("GET", uri, false);
		req.send(null);
		eval(req.responseText.replace(/var [^=]*=/, "v="));
	}
	catch (e) {
	}
	return v;
}

function get_params(spot_id) {
	var lang = localStorage.getItem("windguru.language");
	lang = (!lang ? "fr" : lang == "br" ? "pt" : lang );
	var spot_data = "data.php?spot=" + spot_id;
	var lang_data = "data.php?lang=" + lang;
	return {
		data: get_var(spot_data),
		opts: get_var("defaults/opts.js"),
		lang: get_var(lang_data)
	};
}

function load_scripts(lang) {
	var req = new XMLHttpRequest();
	req.open("GET", "lib/scripts.min.js", false);
	req.send(null);

	var WgLang = lang;  // global required by WgUtils
	eval(req.responseText); // defines global builder WgFcst
	return WgFcst;
}

function display_error(txt) {
	_("loading-blinder").innerHTML = "<center>"+txt+"</center>";
	_("loading-blinder").onclick = go_home;
}

function has_inline_svg() {
	var tmp = document.createElement("div");
	tmp.innerHTML = "<svg></svg>";
	return tmp.firstChild.namespaceURI.match("svg");
}

function fix_svg(node, xml_str) {
	var good = document.adoptNode(
			new DOMParser().parseFromString(xml_str, "text/xml")
                        .documentElement);
	node.parentNode.replaceChild(good, node);
	return good;
}

function fix_svg_nodes(target) {
	var svg = target.getElementsByTagName("svg");
	var nodes = [];
	for (var i=0; i<svg.length; i++)
		nodes.push(svg[i]);
	var tmp = document.createElement("div");
	for (var x; x=nodes.pop(); ) {
		x.parentNode.replaceChild(tmp, x);
		tmp.appendChild(x);
		x.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		x = fix_svg(x, tmp.innerHTML);
		tmp.parentNode.replaceChild(x, tmp);
	}
}

function update_cache(spot_id) {
	var html = _("container").innerHTML;
	localStorage.setItem("windguru.last_update."+spot_id,
				 new Date().getTime());
	localStorage.setItem("windguru.cached_view."+spot_id, html);
	if (!has_inline_svg()) {
		localStorage.setItem("windguru.cached_graph."+spot_id,
			new XMLSerializer().serializeToString(_("graph")));
	}
}

function cache_update_needed(spot_id) {
	var last = localStorage.getItem("windguru.last_update."+spot_id);
	var sixh = 6*60*60*1000;
	if ( !last || parseInt(new Date().getTime() / sixh) * sixh > last )
		return navigator.onLine;
	return false;
}

function mark_cache_update_needed(spot_id) {
	localStorage.removeItem("windguru.last_update."+spot_id);
}

function build_from_cache(spot_id) {
	var html = localStorage.getItem("windguru.cached_view."+spot_id);
	if (! html) return;
	_("container").innerHTML = html;
	if (!has_inline_svg()) {
		fix_svg(_("graph"),
			localStorage.getItem("windguru.cached_graph."+spot_id));
		fix_svg_nodes(_("forecast"));
	}
	remove("home_button");
	remove("anti_click");
	add_anti_click_and_buttons();
}

function remove(id) {
	var e = _(id);
	e.parentNode.removeChild(e);
}

function build_fresh(spot_id, spot_name) {
	var params = get_params(spot_id);
	if (!params.data) return;

	update_params(params, spot_name);
	populate_container();
	build_std_view(params);
	build_graph_view(params);
	compact_views();
	add_anti_click_and_buttons();
}

function init_spot() {
	var params = decodeURIComponent(location.search)
			.match(/([0-9]+)[-:|_]([^,]*)(.*)/);
	if (!params || !params[1] || !params[2]) {
		display_error("Bad spot spec.<br>Use &lt;id&gt;:&lt;name&gt;");
		return;
	}
	var spot_name = params[2];
	var spot_id = params[1];
	var options = params[3];

	install_loading_indicator(spot_name);
	if (cache_update_needed(spot_name)) {
		build_fresh(spot_id, spot_name);
	}
	if (! _("home_button")) {
		build_from_cache(spot_name);
	}
	else {
		update_cache(spot_name);
	}
	if (! _("home_button")) {
		display_error("No data");
		mark_cache_update_needed(spot_name);
		return;
	}

	var view = options.match(/,view=([0-2]),?/);
	set_view(view ? view[1] : 0);
	//rescale();
	hide_loading_indicator();
}
