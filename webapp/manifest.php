<?php
  header('Content-Type: text/cache-manifest');
  echo "CACHE MANIFEST\n";

  $hashes = "";

  $dir = new RecursiveDirectoryIterator(".");
  foreach(new RecursiveIteratorIterator($dir) as $file) {
    if ($file->IsFile() &&
        $file != "./manifest.php" &&
        substr($file->getFilename(), 0, 1) != ".")
    {
      echo substr($file, 2) . "\n";
      $hashes .= md5_file($file);
    }
  }
  $extra = "manifest.extra";
  if (file_exists($extra))
	  echo file_get_contents($extra) . "\n";

  echo "# Hash: " . md5($hashes) . "\n";
?>
