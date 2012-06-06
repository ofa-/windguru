<?php
  header('Content-Type: text/cache-manifest');

  $version  = "./version";
  $extra    = "./manifest.extra";
  $files    = "";
  $mdate    = 0;
  $dir = new RecursiveDirectoryIterator(".");
  foreach(new RecursiveIteratorIterator($dir) as $file) {
    $mdate = max($mdate, filemtime($file)); 
    if (!$file->IsFile())
	continue;
    if (preg_match(":\.php$:", $file->getFilename()))
	continue;
    $files .= substr($file, 2) . "\n";
  }
  $date = date("Y-m-d H:i:s", $mdate);
  echo "CACHE MANIFEST\n";
  echo "# Version: " . file_get_contents($version);
  echo "# Build  : $date\n";
  echo "$files\n";
  echo file_get_contents($extra) . "\n";

?>
