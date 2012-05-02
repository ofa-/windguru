<?php
  header('Content-Type: text/cache-manifest');

  $manifest = "./manifest.php";
  $extra    = "manifest.extra";
  $hashes   = "";
  $files    = "";
  $mdate    = 0;
  $dir = new RecursiveDirectoryIterator(".");
  foreach(new RecursiveIteratorIterator($dir) as $file) {
    if (!$file->IsFile())
	continue;
    if (substr($file->getFilename(), 0, 1) == ".")
	continue;
    if ($file != $manifest)
    {
      $files  .= substr($file, 2) . "\n";
      $hashes .= md5_file($file);
    }
    $mdate = max($mdate, filemtime($file)); 
  }
  $date = date("Y-m-d H:i:s", $mdate);
  $hash = md5($hashes);
  echo "CACHE MANIFEST\n";
  echo "# Version: $date\n";
  echo "# Hash   : $hash\n\n";
  echo "$files\n";
  if (file_exists($extra))
	  echo file_get_contents($extra) . "\n";

?>
