
/* 
 * Variable declarations
 */
var iconoffset = 30;

// The main base unit thing
var Unit = new Unit(12);

/*
 * jQuery functions from here on in ...
 */
$(function() {

	/*
	 * Change the opacity on mouseover, and return it on mouseout.
	 *
	 $('.dice').hover(
	 	function() { $(this).fadeTo("fast",1.0); },
	 	function() { $(this).fadeTo("slow",0.2); }
	 );
	 */

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

				// Construct a pretty unique id
				var uuid = newID()
				
				// Add the figure to the model
				Unit.add_figure(uuid,id,figures[id]);
				
				// Update the dicepool to reflect the changes
				update_dicepool(Unit.get_dice());

				$("<div id='base_"+id+"_"+uuid+"' class='base' style='top: "+yloc+"; left: "+xloc+";'> \
					<img src='"+base+"' /> \
					<span>"+base_id+"</span> \
					<div id='dice_"+id+"_"+uuid+"' class='smalldice'></div> \
					<div id='la_"+id+"_"+uuid+"' class='smallla'></div> \
					</div>"
				).appendTo(this);
				
				// Make it draggable
				base_draggable($("#base_"+id+"_"+uuid));
				// Make it a drop target
				base_droppable($("#base_"+id+"_"+uuid));				
				
			} else {
			
				ui.helper.removeMe = false;
			
			}
			
		}

	}); // #drop_area
	
	function base_draggable(ap_ele) {
		ap_ele.draggable({
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
					var uuid = id[2];
		
					Unit.rm_figure(uuid);
					update_dicepool(Unit.get_dice());
					
					ui.helper.remove();
				}
			} // stop
		}) // draggable
		; // moveable figure icon
	}
	
	function base_droppable(ap_ele) {
		ap_ele.droppable({
			accept: "td.dice, img",
			drop: function(ev, ui) {
		
				// If the draggable is a td.dice - it's come from the dice pool
				if ($(ui.draggable).is("td.dice")) {
					// Break the div id into it's constituent parts
					var id_ar = $(this).attr('id').split("_");
					var idx = id_ar[1];
					var uuid = id_ar[2];
					var class_list = $(ui.helper).attr("class").split(" ");

					add_dice_to_figure(uuid,idx,class_list[0]);
					
					// Then finally update the available number of dice
					update_dicepool(Unit.get_dice());
					
				// If the draggable is an img, it's come from the main drop area
				} else if ($(ui.draggable).is("img")) {
				
					// The dice have just been moved from baseA to baseB
					
					// Get the ID of the draggable helper thing - baseA
					var idA = $(ui.helper).attr('id').split("_");
					var idxA = idA[1];
					var uuidA = idA[2];
					
					// Get the ID of the droppable (this) - baseB
					var idB = $(this).attr('id').split("_");
					var idxB = idB[1];
					var uuidB = idB[2];
					
					// Also we need to know what kind of dice we dropped
					var dice = $(ui.helper).attr("src").split("/");
					dice = dice[dice.length-1];
					dice = dice.split(".");
					dice = dice[0];

					// Update model
					Unit.rm_dice_from_figure(uuidA,dice);
					
					// Update view
					update_figure_dice(uuidA, idxA);

					// Kill the draggable itself
					ui.helper.remove();
					
					// And add a new one to the droppable
					add_dice_to_figure(uuidB,idxB,dice);
				
					ui.helper.removeMe = false;
				}
			}
		}) // droppable
		;
	}
	
	function dice_draggable(ap_ele){
		ap_ele.draggable({
			start: function(event, ui) {
				// flag to indicate that we want to remove element on drag stop
				ui.helper.removeMe = true;
			}, //start
			stop: function(event, ui) {
				// remove draggable if flag is still true
				// which means it wasn't unset on drop into parent
				// so dragging stopped outside of parent
				if (ui.helper.removeMe) {
				
					// Get the ID of the draggable helper thing
					var id = $(ui.helper).attr('id').split("_");
					var idx = id[1];
					var uuid = id[2];
					
					// Also we need to know what kind of dice we dropped
					var dice = $(ui.helper).attr("src").split("/");
					dice = dice[dice.length-1];
					dice = dice.split(".");
					dice = dice[0];
					
					// Update model
					Unit.rm_dice_from_figure(uuid,dice);
					
					// Update view
					update_figure_dice(uuid, idx);
					update_dicepool(Unit.get_dice());

					// Remove the offending item
					ui.helper.remove();
				}
				
			} // stop
		}) // draggable
		; // moveable figure icon
	}
	
	function dice_droppable(ap_ele){
	
	}

	function add_dice_to_figure(Fuuid,idx,type) {

		// Give each dice it's own UUID		
		Duuid = newID();
		
		// Update the model
		Unit.add_dice_to_figure(Fuuid,type,Duuid);
		
		// Resize the UI
		update_figure_dice(Fuuid, idx);
		
		// Add the new graphic
		$("<img id='icon_"+idx+"_"+Fuuid+"_"+Duuid+"' src='res/attributes/"+type+".png' />").appendTo($("#dice_"+idx+"_"+Fuuid));
		
		dice_draggable($("#icon_"+idx+"_"+Fuuid+"_"+Duuid));
	}


}); // main jquery initialiser function
