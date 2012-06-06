<?php

function main() {
	header("Content-Type: text/plain");
	$args = explode("=", $_SERVER['QUERY_STRING']);
	if ($args[0] == "spot") {
		$spot = $args[1];
		$lang = "int";
		$what = ".*data_1";
	}
	else
	if ($args[0] == "lang") {
		$lang = $args[1];
		$spot = "";
		$what = "WgLang";
	}
	else {
		header("unsupported operation", true, 400);
		echo "unsupported operation: '$args[0]'\n";
		echo "use ?spot=<spot id> or ?lang=<lang>\n";
		return;
	}

	$SPOT = "http://www.windguru.cz/$lang/print.php?typ=spot&sn=$spot";
	$OPTS = "&go=1&vs=1&wj=kmh&tj=c&odh=0&doh=24&fhours=180";

	$html = file($SPOT . $OPTS);
	$data = preg_grep(":var $what:", $html);
	foreach ( $data as $i ) echo $i;
}

main();
?>
