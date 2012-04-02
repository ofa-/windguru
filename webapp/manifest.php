<?php
  header('Content-Type: text/cache-manifest');
  echo "CACHE MANIFEST\n";

  $manifest = "./manifest.php";
  $hashes   = "";
  $mdate    = 0;
  $dir = new RecursiveDirectoryIterator(".");
  foreach(new RecursiveIteratorIterator($dir) as $file) {
    if (!$file->IsFile())
	continue;
    if (substr($file->getFilename(), 0, 1) == ".")
	continue;
    if ($file != $manifest)
    {
      echo substr($file, 2) . "\n";
      $hashes .= md5_file($file);
    }
    $mdate = max($mdate, filemtime($file)); 
  }
  $extra = "manifest.extra";
  if (file_exists($extra))
	  echo file_get_contents($extra) . "\n";

  $mdate =  date("Y-m-d H:i:s", filemtime($manifest));
  echo "# Hash: " . md5($hashes) . " / $mdate\n";
?>
