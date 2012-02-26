function parse_conf_line() {
	local line="$@"
	spot=$(parse_xml_attr "spot" "$line")
	page=$(parse_xml_attr "page" "$line")
}

function parse_xml_attr() {
	echo $2 | sed 's/.*'$1'="//g;s/".*//g'
}

function list_spots() {
	cat "$LIST" | grep 'spot="'
}

function init_conf() {
	BASE_DIR=$(dirname "$0")
	CONF_FILE="$BASE_DIR/conf.txt"
	source "$CONF_FILE"
	for var in DOCS SITE FREQ LIST DEPS; do
		if [ -z "${!var}" ]; then
			 echo "$var not defined in $CONF_FILE" >&2
			 exit 1
		fi
	done
	if [ $(list_spots | wc -l) = 0 ]; then
		echo "no spots defined in $LIST" >&2
	fi
}
