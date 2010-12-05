
/* 
 * Variable declarations
 */
var iconoffset = 30;

/*
 * Dice and movement:
 *
 * 4 x 3 array
 *	rows: red, white, blue, move
 *  cols: remaining unplaced, sum (int), sum (natural), name, id
 */
var dice = new Array(4);
for (var x = 0; x < 4; x++) {
	dice[x] = new Array(5);
	
	// Initialise the integer values
	for (var y = 0; y < 3; y++) {
		dice[x][y] = 0;
	}
};

// Initialise the string values
dice[0][3] = "atk";
dice[1][3] = "def";
dice[2][3] = "range";
dice[3][3] = "move";

dice[0][4] = "red";
dice[1][4] = "white";
dice[2][4] = "blue";
dice[3][4] = "move";


/* Local abilities */
var la = new Array(2);
la[0] = new Array(3);
la[1] = new Array(3);

/* Global abilities */
var ga = new Array(2);
ga[0] = new Array(3);
ga[1] = new Array(3);

//var figure_idx  = [];
var figure_list = [];

/*
 * Generate a UUID
 */
function newID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	}).toUpperCase();
}

function add_figure(id,uuid) {
	var cur_idx = figure_list.length;
	//figure_idx[cur_idx] = id;
	figure_list[cur_idx] = [];
	figure_list[cur_idx][0] = id;			// id array value
	figure_list[cur_idx][1] = figures[id];	// complete figure reference
	
	figure_list[cur_idx][2] = 0; // red
	figure_list[cur_idx][3] = 0; // white
	figure_list[cur_idx][4] = 0; // blue
	figure_list[cur_idx][5] = 0; // move
	
	figure_list[cur_idx][6] = uuid;
	
	change_dice(id,'add');
	change_move(id,'add');
}

function rm_figure(id,uuid) {
//	var idx = figure_idx.lastIndexOf(id);
//	figure_idx.splice(idx,1);

	// First clear out all of the dice, and fix those numbers
	

	// Now remove the references in the figure_list
	for (var x = (figure_list.length-1); x >= 0; x--) {
		if (figure_list[x][0] == id) {
			figure_list.splice(x,1);
			break;
		}
	}

//	figure_list.splice(idx,1);

	change_dice(id,'rm');
	change_move(id,'rm');
}

function change_move(id,addrm) {
	
	var av = 0;
	
	for (var x = 0; x < figure_list.length; x++) {
		av += parseFloat(figure_list[x][1][5]);
	}
	
	if (figure_list.length > 0) {
		av = av / figure_list.length;
	} else {
		av = 0;
	}

	var old_val = dice[3][2];
	var new_val = av;

	var int_diff = Math.floor(new_val) - Math.floor(old_val);

	// Natural sum of the dice
	dice[3][2] = new_val;
	
	// The integer equivalent sum
	dice[3][1] = Math.floor(dice[3][2]);

	// The remaining unplaced dice
	dice[3][0] = Math.floor(dice[3][0] + int_diff);

	$("#dice_pool td#"+dice[3][4]+"_count").text(
			 ""+dice[3][0]+
			"/"+dice[3][1]+
			"/"+dice[3][2].toFixed(2)
	);

}

function change_dice(id,addrm) {
	// Use the ID to reference the js lookup table
	var ldice = new Array(4);
	ldice[0] = parseFloat(figures[id][2]); // red
	ldice[1] = parseFloat(figures[id][4]); // white
	ldice[2] = parseFloat(figures[id][3]); // blue
	
	// 0: remaining unplaced
	// 1: sum (int)
	// 2: sum (natural)
	for (var x = 0; x < 3; x++) {
	
		var old_val = dice[x][2];
	
		if (addrm == 'add') {
			var new_val = dice[x][2] + ldice[x];
		} else {
			var new_val = dice[x][2] - ldice[x];
		}
		
		var int_diff = Math.floor(new_val) - Math.floor(old_val);

		// Natural sum of the dice
		dice[x][2] = new_val;
		
		// The integer equivalent sum
		dice[x][1] = Math.floor(dice[x][2]);
	
		// The remaining unplaced dice
		dice[x][0] = Math.floor(dice[x][0] + int_diff);
	
		
//		figure_list[id][x] += int_diff;
	
		update_dicepool(x);
	}
}

function get_idx_from_uuid(uuid) {
	for (var x = 0; x < figure_list.length; x++) {
		if (uuid == figure_list[x][6])
			return x;
	}
}

function update_dicepool(x) {
	$("#dice_pool td#"+dice[x][4]+"_count").text(
			 ""+dice[x][0]+
			"/"+dice[x][1]+
			"/"+dice[x][2].toFixed(2)
	);
	
	if (dice[x][0] > 0) {
		$( "#dice_pool td."+dice[x][4] ).draggable("enable");
	} else {
		$( "#dice_pool td."+dice[x][4] ).draggable("disable");
	}
}

function add_dice(idx, type) {
	var id_ar = idx.split("_");
	var id = id_ar[1];
	var uuid = id_ar[2];

	fid = get_idx_from_uuid(uuid);

	figure_list[fid][get_type(type)] += 1;
	
	dice[get_type(type)-2][0] -= 1;
	update_dicepool(get_type(type)-2);

	var num_of_dice = 0;
	for (var x = 2; x < 6; x++) {
		num_of_dice += parseInt(figure_list[fid][x]);
	}

	// Width of the div
	var w = num_of_dice * 15;

	// Offset of the div to center it
	var o = (((w - 40) / 2) * -1) + 3;

	$("#dice_"+id+"_"+uuid).width(w);
	$("#dice_"+id+"_"+uuid).css('left',o);
}

function rm_dice(id, type) {
	figure_list[id][get_type(type)] -= 1;
}

function get_type(type) {

	switch(type) {
		case "red":		type = 2; break;
		case "white":	type = 3; break;
		case "blue":	type = 4; break;
		case "move":	type = 5; break;
	}
	
	return type;
}

/*
 * jQuery functions from here on in ...
 */
$(function() {

	/*
	 * Change the opacity on mouseover, and return it on mouseout.
	 */
	 $('.dice').hover(
	 	function() { $(this).fadeTo("fast",1.0); },
	 	function() { $(this).fadeTo("slow",0.2); }
	 );

	/*
	 * Change the faction icon on a select box change.
	 */
	 $('select[name="faction"]').change(function() {
		var fimg = "res/insignia/"+$('select[name="faction"]').val()+".png";
		$("header img").attr('src',fimg);
	});

	/*
	 * Change the base type on a select box change
	 */
	$('select[name="basetype"]').change(function() {
		var fimg = "res/units/"+$('select[name="basetype"]').val()+".png";
		//$("#drop_area").css('background-image', 'url("+fimg+")');
		$("div#drop_area > img").attr('src',fimg);
	});

	/*
	 * Make the dice draggable by default
	 */
	$( "#dice_pool td.dice" ).draggable({
		revert: true,
		helper: "clone",
		zIndex: 2700
	});


	/*
	 * Make the <li> tag in #figure_list draggable with the following properties
	 */
	$( "#figure_list>li" ).draggable({
		revert: true, 
		//helper: "clone",
		cursorAt: { top: iconoffset, left: iconoffset },
		helper: function( event ) {
			var id = $(this).attr('id')+":visible";
			var base = $("#"+id+" img").attr('src');
			return $( "<img src='"+base+"' />" )
		},
		zIndex: 2700
	});



	/*
	 * Assign #drop_area to be a droppable area. Also creates more draggables on drop.
	 */
	$("#drop_area").droppable({
		accept: "#figure_list>li, #drop_area div.base",

		drop: function(ev, ui) {

			if ($(ui.draggable).is("li")) {

				// Get the position to drop the cursor 
				var xloc = ev.pageX-460-iconoffset;// - this.offsetLeft;
				var yloc = ev.pageY-105-iconoffset;// - this.offsetTop;
				
				// Force the dropped cursor into the grid
				xloc = (Math.round(xloc / 26) * 26) + 1;
				yloc = (Math.round(yloc / 26) * 26) + 1;

				// Get the ID of the original <li>
				var id = $(ui.draggable).attr('id');

				// Use the original li to get the base image
				var base = $("li#"+id+":visible img").attr('src');
				
				var base_id 	= figures[id][0];

				var uuid = newID()
				
				add_figure(id,uuid);

				$("<div id='base_"+id+"_"+uuid+"' class='base' style='top: "+yloc+"; left: "+xloc+";'> \
						<img src='"+base+"' /> \
						<span>"+base_id+"</span> \
						<div id='dice_"+id+"_"+uuid+"' class='smalldice'></div> \
						<div id='la_"+id+"_"+uuid+"' class='smallla'></div> \
						</div>"
				 )
					
					.appendTo(this)
						
					.draggable({
						grid: [26, 26],
						start: function(event, ui) {
							// flag to indicate that we want to remove element on drag stop
							ui.helper.removeMe = true;
						}, //start
						stop: function(event, ui) {
							// remove draggable if flag is still true
							// which means it wasn't unset on drop into parent
							// so dragging stopped outside of parent
							if (ui.helper.removeMe) {
							
								// Get the ID of the draggable helper thing ...
								var id = $(ui.helper).attr('id').split("_");

								rm_figure(id[1],id[2]);
								
								ui.helper.remove();
							}
						} // stop
					}) // draggable
				
					.droppable({
						accept: "td.dice",
						drop: function(ev, ui) {
							var id = $(this).attr('id'); 
							var id_ar = id.split("_");
							var class_list = $(ui.helper).attr("class").split(" ");
							
							add_dice(id, class_list[0]);
							
							$("<img src='res/attributes/"+class_list[0]+".png' />").appendTo($("#dice_"+id_ar[1]+"_"+id_ar[2]));

						}
					}) // droppable
				
				; // moveable figure icon
				
				
			} else {
			
				ui.helper.removeMe = false;
			
			}
			
		}

	}); // #drop_area

}); // main jquery initialiser function
