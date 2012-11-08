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
 * events.jquery.js
 *
 * The main jquery hooks reside here. As does the initial set up of the model.
 ******************************************************************************/

/* 
 * Variable declarations
 */
var m_Unit = new Unit(8);	// The main base unit thing
var iconoffset = 30;		// Dice icon offset size
var commander = 0;			// Number of commanders on this base

/*
 * jQuery functions from here on in ...
 */
$(function() {

	// Set up some default values to start with ...
	update_basehp();
	m_Unit.set_faction('egyptian');
	update_unitcost();

	// Update the background based on the initial selection
	var selbox = $('select[name="basetype"]').val();

	var fimg = "res/units/"+$('select[name="faction"]').val()+"_"+selbox+".png";
	$("img#fullbg").attr('src',fimg);

	// Update the faction icon based on the initial selection
	fimg = "res/insignia/"+$('select[name="faction"]').val()+".png";
	$("header img").attr('src',fimg);

	// Reveal the one that we're using now.
	$("#grid_"+selbox).css('visibility','visible');
	$("#grid_"+selbox).css('display','block');


/******************************************************************************
 * Default functionality
 ******************************************************************************/

	/*
	 * Change the faction icon on a select box change.
	 */
	 $('select[name="faction"]').change(function() {
		var fimg = "res/insignia/"+$('select[name="faction"]').val()+".png";
		$("header img").attr('src',fimg);

		fimg = "res/units/"+$('select[name="faction"]').val()+"_"+$('select[name="basetype"]').val()+".png";
		$("img#fullbg").attr('src',fimg);

		m_Unit.set_faction($('select[name="faction"]').val());
		update_unitcost();
	});

	/*
	 * Change the base type on a select box change
	 */
	$('select[name="basetype"]').change(function() {
		
		var selbox = $('select[name="basetype"]').val();
		
		var fimg = "res/units/"+$('select[name="faction"]').val()+"_"+selbox+".png";
		//$("#drop_area").css('background-image', 'url("+fimg+")');
		$("img#fullbg").attr('src',fimg);
			
		// Also we should reset the whole thing and force a new max-HP value
		var basetype = selbox.split("_");
		
		if (basetype[0] == "sortie") {
			m_Unit = new Unit(8);
		} else {
			m_Unit = new Unit(12);
		}

		// Hide all the grids
		$(".grid_box").css('visibility','hidden');
		$(".grid_box").css('display','none');
		
		// Reveal the one that we're using now.
		$("#grid_"+selbox).css('visibility','visible');
		$("#grid_"+selbox).css('display','block');

		reset_all();
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
	$(".grid_box").droppable({
		accept: "#figure_list>li, .grid_box div.base",

		drop: function(ev, ui) {

			if ($(ui.draggable).is("li")) {

				// Get the ID of the original <li>
				var id = $(ui.draggable).attr('id');

				var pegs = figures[id][27].split("U");
				
				if ( (parseInt(pegs[0]) + m_Unit.get_hp()) > m_Unit.get_max_figures() ) {
					return;
				}

				// Get the colour ...
				var base_color = figures[id][26];

				if (!commander || (base_color != 'gold') ) {

					// Get the position to drop the cursor 
					var xloc = ev.pageX-460-iconoffset;// - this.offsetLeft;
					var yloc = ev.pageY-105-iconoffset;// - this.offsetTop;
					
					// Force the dropped cursor into the grid
					xloc = (Math.round(xloc / 26) * 26) + 1;
					yloc = (Math.round(yloc / 26) * 26) + 1;

					// Use the original li to get the base image
					var base = $("li#"+id+":visible img").attr('src');

					// The id of the figure can be found directly
					var base_id 	= figures[id][0];
	
					var uuid = add_figure(figures, id);
	
					$("<div id='base_"+id+"_"+uuid+"' class='base' style='top: "+yloc+"px; left: "+xloc+"px;'> \
						<img src='"+base+"' /> \
						<span>"+base_id+"</span> \
						<div id='dice_"+id+"_"+uuid+"' class='smalldice'></div> \
						<div id='la_"+id+"_"+uuid+"' class='smallla'></div> \
						</div>"
					).appendTo(this);
					
					var base = $("#base_"+id+"_"+uuid);

					// Make it draggable
					base_draggable(base);
					// Make it a drop target
					base_droppable(base);

					// Allow it to be secondary
					base_rightclickable(base);
					
					if (base_color == 'gold') {
					// If it's gold, let's only have one, hmm?
						commander = 1;
					}
					
				}
			} else {
				ui.helper.removeMe = false;
			}
			
		}

	}); // #drop_area

/******************************************************************************
 * Base functions
 ******************************************************************************/

 	function base_rightclickable(ele) {
	  ele.bind("contextmenu",function(event) {
	  	event.preventDefault();
      $(this).children("span").toggle();
			// Get the ID of the thing ...
			var id = $(this).attr('id').split("_");
			var uuid = id[2];
      var fig = m_Unit.get_figure(uuid);
      fig.slot_type(!fig.secondary);
      m_Unit.update_pegcount();
      update_basehp();
      m_Unit.update_cost();
      update_unitcost();
		});
	}

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

					ui.helper.remove();

					// Get the colour ...
					var base_color = m_Unit.get_figure(uuid).get_figure()[26];
					if (base_color == 'gold') {
						commander = 0;
					}

					rm_figure(uuid);

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
				
				// If the draggable is an img.la_pool, then it's a local ability from the LA pool
				} else if ($(ui.draggable).is("img.la_pool")) {

					// ID of the thing that's being dropped on
					var id = $(this).attr('id').split("_");
					//console.log("Dropped on: "+id);
					var figure_idx = id[1];
					var figure_uuid = id[2];

					// ID of the thing that's being dropped - it's a clone of the original
					var id = $(ui.helper).attr('id').split("_");
					//console.log("Being dropped: "+id);
					var la_name = id[1];

					if (m_Unit.figure_has_la(figure_uuid, la_name)) {
						add_la_to_figure(figure_uuid,figure_idx,la_name);
						//update_la();
					}

				// If the draggable is an img.smallla, then it's a local ability from another base
				} else if ($(ui.draggable).is("img.smallla")) {
					
					// The LA icon has just been moved from baseA to baseB

					// Get the ID of the draggable helper thing - baseA
					var id		= $(ui.helper).attr('id').split("_");
					var Fidx	= id[1];
					var Fuuid	= id[2];
					var Luuid	= id[3];

					// Get the ID of the droppable (this) - baseB
					var idB = $(this).attr('id').split("_");
					var idxB = idB[1];
					var uuidB = idB[2];

					var png		= $(ui.helper).attr("src").split("/");
					png			= png[png.length-1].split(".");
					png			= png[0].split("lsa-");
					var la_name		= png[1];

					if (m_Unit.figure_has_la(uuidB, la_name)) {
						// Remove this item from the model
						m_Unit.rm_la_from_figure(Fuuid, la_name, Luuid);
		
						// Remove the item from the DOM
						ui.helper.remove();
						
						// Update view
						update_figure_la(Fuuid, Fidx);

						// Add a new item to the model and DOM
						add_la_to_figure(uuidB,idxB,la_name);
						
						m_Unit.update_cost();
						update_unitcost();
					}

					// Don't kill the helper, please
					ui.helper.removeMe = false;
				
				// If the draggable is an img, it's a dice from another base
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
					m_Unit.rm_dice_from_figure(uuidA,dice);
					
					// Update view
					update_figure_dice(uuidA, idxA);

					// Kill the draggable itself
					ui.helper.remove();
					
					// And add a new one to the droppable
					add_dice_to_figure(uuidB,idxB,dice);

					m_Unit.update_cost();
					update_unitcost();

					ui.helper.removeMe = false;
				}
			}
		}) // droppable
		;
	}

/******************************************************************************
 * Dice functions
 ******************************************************************************/

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
					m_Unit.rm_dice_from_figure(uuid,dice);
					
					// Update view
					update_figure_dice(uuid, idx);
					update_dicepool();

					// Remove the offending item
					ui.helper.remove();
					
					m_Unit.update_cost();
					update_unitcost();
				}
				
			} // stop
		}) // draggable
		; // moveable figure icon
	}

	function add_dice_to_figure(Fuuid,idx,type) {

		// Give each dice it's own UUID		
		Duuid = newID();
		
		// Update the model
		m_Unit.add_dice_to_figure(Fuuid,type,Duuid);
		
		// Resize the UI
		update_figure_dice(Fuuid, idx);
		
		// Add the new graphic
		$("<img id='icon_"+idx+"_"+Fuuid+"_"+Duuid+"' src='res/attributes/"+type+".png' />").appendTo($("#dice_"+idx+"_"+Fuuid));
		dice_draggable($("#icon_"+idx+"_"+Fuuid+"_"+Duuid));
									
		// Then finally update the available number of dice
		update_dicepool();
		
		m_Unit.update_cost();
		update_unitcost();
	}

/******************************************************************************
 * Local ability functions
 ******************************************************************************/

	function la_draggable(ap_ele){
		ap_ele.draggable({
			revert: true,
			start: function(event, ui) {
				// flag to indicate that we want to remove element on drag stop
				ui.helper.removeMe = true;
			}, //start
			stop: function(event, ui) {
				// remove draggable if flag is still true
				// which means it wasn't unset on drop into parent
				// so dragging stopped outside of parent
				if (ui.helper.removeMe) {
				
					// We need to know the ID of the item we're dragging
					// Which interestingly, shows us the UUID of the LA
					// and the UUID of the figure we're dragging it from.
					var id		= $(ui.helper).attr('id').split("_");
					var png		= $(ui.helper).attr("src").split("/");

					// Remove the DOM element representing the starting items
					ui.helper.remove();

					var Fidx	= id[1];
					var Fuuid	= id[2];
					var Luuid	= id[3];

					png			= png[png.length-1].split(".");
					png			= png[0].split("lsa-");
					var la_name	= png[1];

					// Remove this item from the model
					m_Unit.rm_la_from_figure(Fuuid, la_name, Luuid);

					// Update view
					update_figure_la(Fuuid,Fidx); // Fix the spacing
					update_la(); // Sort out the pool icons
					
					m_Unit.update_cost();
					update_unitcost();
				}
				
			} // stop
		}) // draggable
		; // moveable figure icon
	}

	function add_la_to_figure(Fuuid,Fidx,la_name) {
	
		// Give each LA it's own UUID
		Luuid = newID();
		
		// Update the model
		m_Unit.add_la_to_figure(Fuuid,la_name,Luuid);
		
		update_figure_la(Fuuid,Fidx);
		
		// Update the UI
		update_la();

		// Add the new graphic
		$("<img class='smallla' id='laicon_"+Fidx+"_"+Fuuid+"_"+Luuid+"' src='res/special_abilities/lsa-"+la_name+".png' />").appendTo($("#la_"+Fidx+"_"+Fuuid));
		la_draggable($("#laicon_"+Fidx+"_"+Fuuid+"_"+Luuid));
		
		m_Unit.update_cost();
		update_unitcost();
	}

}); // main jquery initialiser function
