cd $(dirname $0)
UPLOAD_SITE=".upload.site"
if [ ! -f $UPLOAD_SITE ]; then
	echo "URL='ftp://<user>:<pass>@<host>'" > $UPLOAD_SITE
	echo "DIR=" >> $UPLOAD_SITE
	echo "created sample upload site conf file: $UPLOAD_SITE"
	echo "please edit and provide credentials and target dir."
	exit 1
fi
. $UPLOAD_SITE
[ -z "$URL" ] && { echo "URL not defined in $UPLOAD_SITE"; exit 1; }
[ -z "$DIR" ] && { echo "DIR not defined in $UPLOAD_SITE"; exit 1; }

LFTP_URL=$URL/$DIR
if ! lftp $LFTP_URL -e "exit" 2> /dev/null ; then
	lftp $URL -e "mkdir $DIR; exit" || exit 1
fi

cd webapp
version=$(cat version)
major=${version%.*}
minor=${version##*.}
echo $major.$((minor+1)) > version
lftp $LFTP_URL -e "mirror -X *.bak -X *.orig -Rn .; exit"
