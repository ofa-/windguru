function get_status() {
	var txt = localStorage.getItem("windguru.preferred_spot");
	txt = txt ? txt.replace(/.*name=/, "").replace(/\..*/, "") : "";
	txt = decodeURIComponent(txt);
	txt += navigator.onLine ? "" : " (offline)";
	return txt;
}

