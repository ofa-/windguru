function create_spinner() {
	var elt = document.createElement("div");
	elt.setAttribute("class", "spinner");
	for (var i=1; i<13; i++) {
		elt.appendChild(document.createElement("div"));
		elt.lastChild.setAttribute("class", "bar" + i);
	}
	return elt;
}

