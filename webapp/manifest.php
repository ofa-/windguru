<?php
  header('Content-Type: text/cache-manifest');

  $manifest = "./manifest.php";
  $extra    = "./manifest.extra";
  $version  = "./version";
  $files    = "";
  $mdate    = 0;
  $dir = new RecursiveDirectoryIterator(".");
  foreach(new RecursiveIteratorIterator($dir) as $file) {
    if (!$file->IsFile())
	continue;
    if (substr($file->getFilename(), 0, 1) == ".")
	continue;
    if ($file == $manifest)
	continue;
    $files .= substr($file, 2) . "\n";
    $mdate = max($mdate, filemtime($file)); 
  }
  $date = date("Y-m-d H:i:s", $mdate);
  echo "CACHE MANIFEST\n";
  echo "# Version: " . file_get_contents($version);
  echo "# Build  : $date\n";
  echo "$files\n";
  echo file_get_contents($extra) . "\n";

?>
