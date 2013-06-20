<?php

/*

    Open Legions Unit Builder
    Copyright (C) 2010-2012  Pieter E Sartain

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

/* Ensure the charset info is set in the first 1024 bytes of the page, as per
 * http://stackoverflow.com/questions/11633162/character-encoding-not-declared-in-html-document
 */
?>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>Open Legions Unit Builder</title>

<?php
// Figure list as an array

$fid = fopen("figures.txt",'r');
$headings = fgetcsv($fid);
$figures = array();
$idx = 0;
while(($figure = fgetcsv($fid)) !== FALSE) {
	//$figures[$figure[0]] = $figure;
	foreach($figure as $key => $value) {
		$figures[$idx][$key] = trim($value);
		switch($key) {
			case 2:
			case 3:
			case 4:
			case 5:
			case 7:
			case 9:
			case 11:
			case 13:
				$figures[$idx][$key] = round( ( (float)$figures[$idx][$key] ) * 100 );
			break;
		}
	}
	$idx++;
}
fclose($fid);

function createAbility($ability,$cost,$type) {
	return "<td 	class='ability' 
					style=\"background-image: 
							url('res/special_abilities/".$type."-".str_replace(" ","-",strtolower(trim($ability))).".png')
						\"
					>&nbsp;</td><td>".($cost/100)."</td>";
}

function createLi($figure,$idx) {
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
		$str .= "<td class='red dice'>&nbsp;</td><td id='red'>		  ".($figure[2]/100)."	</td>";
		$str .= "<td class='blue dice'>&nbsp;</td><td id='blue'>		".($figure[3]/100)."	</td>";
		$str .= "<td class='white dice'>&nbsp;</td><td id='white'>	".($figure[4]/100)."	</td>";
		$str .= "<td class='move dice'>&nbsp;</td><td id='move'>		".($figure[5]/100)."	</td>";
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

<link type="text/css" href="stylesheets/ui-lightness/jquery-ui-1.8.6.custom.css" rel="Stylesheet" />	
<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.8.6.custom.min.js"></script>

<script language="javascript">
<?php
		echo "var figures = [";
		foreach($figures as $idx => $figure) {
			echo "[";
			foreach($figure as $key => $value) {
				switch($key) {
					case 2:
					case 3:
					case 4:
					case 5:
					case 7:
					case 9:
					case 11:
					case 13:
					case 14:
					case 15:
					case 16:
					case 17:
					case 18:
					case 19:
					case 20:
					case 21:
						echo "$value,";
					break;
					default:
						echo "\"$value\",";
					break;
				}
			}
			echo "],";
		}
		echo "];";
?>
</script>

<script type="text/javascript" src="js/functions.js"></script>
<script type="text/javascript" src="js/figure.class.js"></script>
<script type="text/javascript" src="js/unit.class.js"></script>
<script type="text/javascript" src="js/view.js"></script>
<script type="text/javascript" src="js/events.jquery.js"></script>

<link type="text/css" href="stylesheets/screen.css" rel="stylesheet" media="screen, print" />
<link type="text/css" href="stylesheets/print.css" rel="stylesheet" media="print" />

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
					<option value="sortie_landscape">Sortie</option>
					<option value="cavalry_landscape">Cavalry</option>
				</select>
				<br />
				<select name='baserotation'>
					<option value="0">Landscape</option>
					<option value="90">Portrait</option>
				</select>
			</td>
		</tr>
	</table>

	<div id="global_ability_pool"></div>

	<div id='base_hp'></div>

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

	<div id="local_ability_pool"></div>

	<div id="unrounded_points">0</div>

</header>

<div id="scroll_list">
<?php echo createUl($figures) ?>
</div>

<div id="base">
	<img id="fullbg" src="" />

	<?php

	$cavalry = '';
	for ($x = 0; $x < 7*18; $x++) {
		$cavalry .= "<div class='grid'>&nbsp;</div>";
	}

	$sortie = '';
	for ($y = 0; $y < 7*8; $y++) {
		$sortie .= "<div class='grid'>&nbsp;</div>";
	}

	echo "<div class='grid_box' id='grid_cavalry_landscape'>".$cavalry."</div>";
	echo "<div class='grid_box' id='grid_sortie_landscape'>".$sortie."</div>";

	?>

	<div id="base_info">
		<div id="movement">
			<div id="move_n">0</div>
			<div id="move_e">0</div>
			<div id="move_w">0</div>
			<div id="move_s">0</div>
		</div>
		<div id="uname"><input type="text"></input></div>
		<div id='points'>
			<div id='base_cost'></div>
			POINTS
		</div>
		<div id="ga_base_pool"></div>
	</div>
</div>

</body>
</html>
