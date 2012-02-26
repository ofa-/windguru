UPLOAD_SITE=".upload.site"
if [ ! -f $UPLOAD_SITE ]; then
	echo "missing upload site conf file: $UPLOAD_SITE"
	echo
	echo "echo 'ftp://<user>:<pass>@<host>/<dir>' > $UPLOAD_SITE"
	echo "lftp \$(cat $UPLOAD_SITE) -e 'mkdir -p <dir>; exit'"
	exit 1
fi

LFTP_URL=$(cat $UPLOAD_SITE)
if ! lftp $LFTP_URL -e "exit" ; then
	echo "lftp error: destination directory does not exist, or invalid url."
	exit 1;
fi

cd webapp
lftp $LFTP_URL -e "mirror -Rn .; exit"
