<?php

function main() {
	$args = explode(",", $_SERVER['QUERY_STRING']);
	$spot = $args[0];
	$lang = $args[1];
	$what = $args[2];
	$dbg  = strpos($args[3], "debug") !== false;
	$end  = strpos($args[3], "mark-end") !== false;

	$SPOT = "http://www.windguru.cz/$lang/print.php?typ=spot&sn=$spot";
	$OPTS = "&go=1&vs=1&wj=kmh&tj=c&odh=0&doh=24&fhours=180";

	header("Content-Type: text/plain");
	if ($dbg) echo "spot=$spot, lang=$lang, what=$what\n$SPOT$OPTS\n";

	$x = explode("!", $what);
	$what = $x[0];
	$excl = $x[1];
	$html = file($SPOT . $OPTS);
	$data = preg_grep(":^(var $what|<script .* src=\"$what):", $html);
	if ($excl)
		$data = preg_grep(":$excl:", $data, true);

	foreach ( $data as $i ) echo $i;

	if ($end) echo "END_MARKER\n";
}

main();
?>
