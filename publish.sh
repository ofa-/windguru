#!/bin/bash
CONFIG_FILE=".upload.site"

function load_config() {
	[ -f $CONFIG_FILE ]		|| { create_default_config; return 1; }
	. $CONFIG_FILE			|| return 1
	check_vars "URL DIR SRC"	|| return 1
	[ -d "$SRC" ] 			|| error "$SRC: not a directory"
}

function check_vars() {
	for var in $@; do
		[ -z "${!var}" ] && not_def="$not_def $var"
	done
	[ -z "$not_def" ] || error "no value defined for:$not_def"
}

function create_default_config() {
	echo "URL='ftp://<user>:<pass>@<host>'" > $CONFIG_FILE
	echo "DIR=		# target dir" >> $CONFIG_FILE
	echo "SRC=webapp	# local  dir" >> $CONFIG_FILE
	echo "created sample upload site conf file: $CONFIG_FILE"
}

function check_create_upload_dir() {
	lftp $URL/$DIR -e "exit" 2> /dev/null	&& return 0
	lftp $URL -e "mkdir $DIR; exit"		|| return 1
}

function abort() {
	error $@ || exit 1
}

function error() {
	echo $@ && return 1
}

function set_version() {
	arg=$1

	version=$(cat version)
	major=${version%.*}
	minor=${version##*.}
	case $arg in
		"")	return 0 ;;
		-i)	version=$major.$((minor+1)) ;;
		*)	version=$arg
			parse_version || return 1 ;;
	esac
	echo $version > version
}

function parse_version() {
	expr match $version '^[0-9]\+\.[0-9]\+$' > /dev/null
}

function publish_local_directory() {
	lftp $URL/$DIR -e "mirror -X *.bak -X *.orig -Rn .; exit" || return 1
	echo "Published version: $(cat version)"
}

function main() {
	cd $(dirname $0)
	load_config		|| abort "please edit config file: $CONFIG_FILE"
	check_create_upload_dir	|| abort "cannot create upload directory: $DIR"
	cd $SRC
	set_version $1		|| error "failed to set version: $1"
	publish_local_directory || abort "failed to publish directory: $SRC"
}

main $1
