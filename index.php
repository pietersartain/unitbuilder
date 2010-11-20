<?php

// Figure list as an array

$fid = fopen("figures.txt",'r');
$headings = fgetcsv($fid);
//print_r($figures);

//unset($figures[0]);

//function parse_ability($name) {
//	$retval = str_replace(" ","-",strtolower($name));

function createAbility($ability,$cost,$type) {
	return "<td 	class='ability' 
					style=\"background-image: 
							url('res/special_abilities/".$type."-".str_replace(" ","-",strtolower($ability)).".png')
						\"
					>&nbsp;</td><td>".$cost."</td>";
}

function createLi($figure) {
	$str = "<li id='".$figure[0]."'>";
	
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
		$str .= "<td class='red'>&nbsp;</td><td>	".$figure[2]."	</td>";
		$str .= "<td class='blue'>&nbsp;</td><td>	".$figure[3]."	</td>";
		$str .= "<td class='white'>&nbsp;</td><td>	".$figure[4]."	</td>";
		$str .= "<td class='move'>&nbsp;</td><td>	".$figure[5]."	</td>";
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

function createUl($fid) {
	$str = "<ul id='figure_list'>";

	/*foreach ($figures as $figure) {
		$str .= createLi($figure);
	}*/
	
	while(($figure = fgetcsv($fid)) !== FALSE) {
		$str .= createLi($figure);
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
<!--<script type="text/javascript" src="js/jquery.draggable.js"></script>-->

<script>

	$(function() {

		$('select[name="faction"]').change(function() {
			var fimg = "res/insignia/"+$('select[name="faction"]').val()+".png";
			$("header img").attr('src',fimg);
		});

		$( "#figure_list>li" ).draggable({
			revert: true, 
			helper: "clone",
		});

		$("#drop_area").droppable({
			accept: "li, div",

			drop: function(ev, ui) {

				if ($(ui.draggable).is("li")) {
	
					var id = $(ui.draggable).attr('id')+":visible";
					
					var red = $("#"+id+" .red").text();
					var white = $("#"+id+" .white").text();
					var blue = $("#"+id+" .blue").text();
					var move = $("#"+id+" .move").text();
					
					var base_id = $("#"+id+" .base_id").text();
					//var name = $("#"+id+" .name").text();
					
					var base = $("#"+id+" img").attr('src');
	
					//console.log(base);
	
					$("<div class='base'><img src='"+base+"' /><span>"+base_id+"</span></div>").appendTo(this).draggable({
						//containment: "parent", // Constrains to the drop area
						grid: [10, 10],
						//revert: "invalid", // Reverts the draggable when you drop on an invalid area
						start: function(event, ui) {
							// flag to indicate that we want to remove element on drag stop
							ui.helper.removeMe = true;
						},
						stop: function(event, ui) {
							// remove draggable if flag is still true
							// which means it wasn't unset on drop into parent
							// so dragging stopped outside of parent
							if (ui.helper.removeMe) {
							  ui.helper.remove();
							}
						}
					});
				} else {
				
					ui.helper.removeMe = false;
				
				}
				
			}

		});
	});

</script>

<style>

body {font-family: tahoma;}

div#drop_area {width: 800px; height: 600px; border: 1px solid black; float: left;}

div#drop_area > div > span {position: relative; left: 10px; top: -12px; background: #ffffdd; font-size: 70%;}

ul#figure_list {padding: 0px; margin: 0px;}
ul#figure_list li {	border: 1px solid black; width: 380px; background: silver; 
					list-style: none; padding: 0px; margin: 0px;
				}

ul#figure_list li:after, 
header:after 
{
	content: ".";
	display: block;
	height: 0;
	clear: both;
	visibility: hidden;
}

ul#figure_list > li > p {margin: 0px; padding: 0px; display: block;}

ul#figure_list > li table {width: 100%;}
ul#figure_list > li table td {width: 12.5%;}

.red, .white, .blue, .move {
							/*
							display: inline; 
							width: 120px; height: 25px;
							padding-left: 40px;
							
							width: 40px;
							*/
							background-repeat:no-repeat;
							background-position: 0px -10px;
							opacity: 0.1;
							}

.red 	{	background-image: url('res/attributes/red.png');	}
.white 	{	background-image: url('res/attributes/white.png');	}
.blue 	{	background-image: url('res/attributes/blue.png');	}
.move 	{	background-image: url('res/attributes/move.png');	}

.ability{		/*
				display: inline; width: 110px; height: 20px;
				padding-left: 50px; color: #000;
				
				width: 25%;
				*/
				background-repeat:no-repeat;
				background-position: 0px -15px;
				opacity: 0.2;
		}

.base_id{	display: inline; width: 110px; height: 20px;
				background-repeat:no-repeat;
				background-position: 0px -30px;
				padding-left: 40px; color: #ffffdd; font-weight: bold;
		}
.mercenary 	{	background-image: url('res/insignia/mercenary.png');	}
.han 		{	background-image: url('res/insignia/han.png');	}
.roman 		{	background-image: url('res/insignia/roman.png');	}
.egyptian 	{	background-image: url('res/insignia/egyptian.png');	}

.base {width: 40px; height: 60px;}

.name {width: 290px; display: inline; margin-left: 10px; font-weight: bold; font-size: 120%;}

div#drop_area > div {/* background: yellow; border: 0px solid red; */
					/*width: 100px; height: 100px; */
					position: absolute; float: left;}

div#scroll_list {overflow: auto; height: 600px; width: 400px; float: left;}

</style>

</head>

<body>

<header>

<img src="res/insignia/egyptian.png" />

<select name='faction'>
	<option value="egyptian">Egypt</option>
	<option value="han">Han Dynasty</option>
	<option value="mercenary">Mercenary</option>
	<option value="roman">Rome</option>
</select>

</header>

<div id="scroll_list">
<?php echo createUl($fid) ?>
</div>

<div id="drop_area">

</div>



</body>
</html>