<?php

$fid = fopen("figures.txt",'r');
$headings = fgetcsv($fid);
$figures = array();
while(($figure = fgetcsv($fid)) !== FALSE) {
	//$figures[$figure[0]] = $figure;
	$figures[] = $figure[27];
}
fclose($fid);

$width = count($figures[0]);
echo $width;
//print_r($figures[0][$width-1]);

echo "<pre>";

print_r($figures);

print_r(array_unique($figures));

echo "</pre>";
?>