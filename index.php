<?php

/*

    Open Legions Unit Builder
    Copyright (C) 2010  Pieter E Sartain

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
 ******************************************************************************
 * index.php
 *
 * The main page.
 ******************************************************************************/

// Figure list as an array

$fid = fopen("figures.txt",'r');
$headings = fgetcsv($fid);
$figures = array();
while(($figure = fgetcsv($fid)) !== FALSE) {
	//$figures[$figure[0]] = $figure;
	$figures[] = $figure;
}
fclose($fid);

//print_r($figures);

//unset($figures[0]);

//function parse_ability($name) {
//	$retval = str_replace(" ","-",strtolower($name));

function createAbility($ability,$cost,$type) {
	return "<td 	class='ability' 
					style=\"background-image: 
							url('res/special_abilities/".$type."-".str_replace(" ","-",strtolower(trim($ability))).".png')
						\"
					>&nbsp;</td><td>".$cost."</td>";
}

function createLi($figure,$idx) {
	//$str = "<li id='".$figure[0]."'>";
	$str = "<li id='".$idx."'>";
	
	$base = strtolower($figure[26]).$figure[27];
	
	// 26: colour; 27: type;
	$str .= "<div style='float: left; width:25px;' class='base'><img src='res/figures/$base.png' style='width:25px;' /></div>";

	switch (strtoupper(substr($figure[0],1,1))) {
	case "E":
		$faction = "egyptian";
		break;
	case "R":
		$faction = "roman";
		break;
	case "H":
		$faction = "han";
		break;
	case "M":
		$faction = "mercenary";
		break;
	}

	$str .= "<div style='float: left; width: 80%;'>";
		$str .= "<div class='$faction base_id'>".$figure[0]."</div>";
		$str .= "<div class='name'>		".$figure[1]."	</div>";
		$str .= "<br /><table><tr>";
		$str .= "<td class='red dice'>&nbsp;</td><td id='red'>		".$figure[2]."	</td>";
		$str .= "<td class='blue dice'>&nbsp;</td><td id='blue'>		".$figure[3]."	</td>";
		$str .= "<td class='white dice'>&nbsp;</td><td id='white'>	".$figure[4]."	</td>";
		$str .= "<td class='move dice'>&nbsp;</td><td id='move'>		".$figure[5]."	</td>";
		$str .= "</tr><tr>";

		if ($figure[6] != "") {
			$str .= createAbility($figure[6],$figure[7],"lsa");
		} else {
			$str .= "<td>&nbsp;</td><td>&nbsp;</td>";
		}
	
		if ($figure[8] != "") {
			$str .= createAbility($figure[8],$figure[9],"lsa");
		} else {
			$str .= "<td>&nbsp;</td><td>&nbsp;</td>";
		}
	
		if ($figure[10] != "") {
			$str .= createAbility($figure[10],$figure[11],"gsa");
		} else {
			$str .= "<td>&nbsp;</td><td>&nbsp;</td>";
		}
	
		if ($figure[12] != "") {
			$str .= createAbility($figure[12],$figure[13],"gsa");
		} else {
			$str .= "<td>&nbsp;</td><td>&nbsp;</td>";
		}

		$str .= "</tr></table>";
	$str .= "</div>";
	
	$str .= "<div style='float: left;'>";
	$str .= "</div>";
	

	
	$str .= "</li>";
	return $str;
}

function createUl($figures) {
	$str = "<ul id='figure_list'>";
	
	foreach($figures as $idx => $figure) {
		$str .= createLi($figure,$idx);
	}

	$str .= "</ul>";
	
	return $str;
}

?>

<html>

<head>

<link type="text/css" href="css/themename/jquery-ui-1.8.6.custom.css" rel="Stylesheet" />	
<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.8.6.custom.min.js"></script>

<script language="javascript">

	var figures = new Array(<?php echo count($figures) ?>);
	
	//figures[0] = new Array(5);
	//figures[0][0] = 'Wibble';

	<?php
		foreach($figures as $idx => $figure) {
			echo "figures[$idx] = new Array(".count($figure).");";
			foreach($figure as $key => $value) {
				echo "figures[$idx][$key] = \"$value\";";
			}
		}
	?>

</script>

<!--<script type="text/javascript" src="main.js"></script>-->

<script type="text/javascript" src="functions.js"></script>
<script type="text/javascript" src="figure.class.js"></script>
<script type="text/javascript" src="unit.class.js"></script>
<script type="text/javascript" src="view.js"></script>
<script type="text/javascript" src="events.jquery.js"></script>

<link type="text/css" href="main.css" rel="Stylesheet" />	

</head>

<body>

<header>

<table>
	<tr>
		<td><img src="res/insignia/egyptian.png" /></td>
		<td>
			<select name='faction'>
				<option value="egyptian">Egypt</option>
				<option value="han">Han Dynasty</option>
				<option value="mercenary">Mercenary</option>
				<option value="roman">Rome</option>
			</select>
			<br />
			<select name='basetype'>
				<option value="sortie_portrait">Sortie (Portrait)</option>
				<option value="sortie_landscape">Sortie (Landscape)</option>
				<option value="cavalry_portrait">Cavalry (Portrait)</option>
				<option value="cavalry_landscape">Cavalry (Landscape)</option>
			</select>
		</td>
	</tr>
</table>

</header>

<div id="scroll_list">
<?php echo createUl($figures) ?>
</div>

<!--<div id="leftbar">&nbsp;</div>
<div id="fullbg">&nbsp;</div>-->

<img id="fullbg" src="" />

<?php
//<div id="drop_area" >

$cavalry = '';
for ($x = 0; $x < 7*18; $x++) {
	$cavalry .= "<div class='grid'>&nbsp;</div>";
}

$sortie = '';
for ($y = 0; $y < 7*8; $y++) {
	$sortie .= "<div class='grid'>&nbsp;</div>";
}

echo "<div class='grid_box' id='grid_cavalry_landscape'>".$cavalry."</div>";
echo "<div class='grid_box' id='grid_cavalry_portrait'>".$cavalry."</div>";
echo "<div class='grid_box' id='grid_sortie_landscape'>".$sortie."</div>";
echo "<div class='grid_box' id='grid_sortie_portrait'>".$sortie."</div>";

// </div>
?>

<div id='base_cost'>
</div>

<div id='base_hp'>
</div>

<div id="dice_pool">

	<table>
		<tr>
			<td class='red dice'>&nbsp;</td><td id="red_count">0/0/0.00</td>
			<td class='white dice'>&nbsp;</td><td id="white_count">0/0/0.00</td>
		</tr>
		<tr>
			<td class='blue dice'>&nbsp;</td><td id="blue_count">0/0/0.00</td>
			<td class='move dice'>&nbsp;</td><td id="move_count">0/0/0.00</td>
		</tr>
	</table>
</div>

<div id="local_ability_pool">
</div>

<div id="movement">
	<table>
		<tr>
			<td></td>
			<td></td>
			<td id='move_n'>0</td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td></td>
			<td></td>
			<td>N</td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td id='move_w'>0</td>
			<td>W</td>
			<td></td>
			<td>E</td>
			<td id='move_e'>0</td>
		</tr>
		<tr>
			<td></td>
			<td></td>
			<td>S</td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td></td>
			<td></td>
			<td id='move_s'>0</td>
			<td></td>
			<td></td>
		</tr>
	</table>
</div>

<div id="global_ability_pool">
</div>

</body>
</html>
