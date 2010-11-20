<?php

// Figure list as an array

$fid = fopen("figures.txt");
$figures = fgetcsv($fid);

unset($figures[0]);

function createLi($figure) {
	$str = "<li id=''>";
	
	//$str = "";
	
	print_r($figure);
	
	$str .= "</li>";
	return $str;
}

function createUl($figures) {
	$str = "<ul id='figure_list'>";

	foreach ($figure as $figures) {
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

		$( "#figure_list>li" ).draggable({
			revert: true, 
			helper: "clone",
		});

		$("#drop_area").droppable({
			accept: "li",

			drop: function(ev, ui) {

				var id = $(ui.draggable).attr('id')+":visible";
				
				var points = $("#"+id+" > .points").text();

				$("<div id='stuff'>"+points+"</div>").appendTo(this).draggable({
					containment: "parent", 
					grid: [20, 20],
				});
				
			}

		});
	});

</script>

<style>

div#drop_area {width: 800px; height: 600px; border: 1px solid black; float: left;}

ul#figure_list {float: left;}

ul#figure_list li {border: 1px solid blue; width: 200px; background: blue;}

#draggable { width: 150px; height: 150px; padding: 0.5em; background: blue;}

.demo { width: 800px; height: 600px; }

div#drop_area > div { background: yellow; border: 0px solid red; width: 100px; height: 100px; position: absolute; float: left;}

</style>

</head>

<body>

<div>
	<ul id="figure_list">
		<li id='fid1'>Item1 <p class='points'>100</p></li>
		<li id='fid2'>Item2</li>
		<li id='fid3'>Item3</li>
		<li id='fid4'>Item4</li>
	</ul>
</div>

<div id="drop_area">

</div>



</body>
</html>