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
 * view.js
 *
 * Contains functions for manipulating the view - which in this case is mostly
 * the DOM.
 ******************************************************************************/

/******************************************************************************
 * Figure functions
 ******************************************************************************/

function add_figure(figures, id) {
	// Construct a pretty unique id
	var uuid = newID()
	
	// Add the figure to the model
	m_Unit.add_figure(uuid,id,figures[id]);
	
	// Update the dicepool to reflect the changes
	update_dicepool();
	
	// Update the global abilities
	update_ga()
	
	// Local abilities updated at the end of Unit.update_la()
	// Kinda naughty.
	
	// Update the HP count.
	update_basehp();
	
	// Update the movement tray
	update_movement();
	
	update_sides();
	
	update_unitcost();
	
	return uuid;
}

function rm_figure(uuid) {
	m_Unit.rm_figure(uuid);
	update_dicepool();
	update_la();
	update_basehp();
	update_movement();
	update_sides();
	update_unitcost();
}

/******************************************************************************
 * Simple functions
 ******************************************************************************/
function reset_all() {

	$(".grid_box div.base").remove();		// Clear any placed figures
	update_dicepool(m_Unit.get_dice());	// Reload the values from the m_Unit
	//update_la();
	$("#local_ability_pool").empty();		// update_la() doesn't work so well. Banish the LAs.
	update_ga();							          // Banish the GAs
	update_basehp();						        // Reload the base HP values
	update_movement();
	update_unitcost();

}

function update_basehp() {
	$("#base_hp").empty();
	$("<span>"+m_Unit.get_hp()+"/"+m_Unit.get_max_figures()+"</span>").appendTo("#base_hp");
}

function update_movement() {

	var move = m_Unit.get_movement();

	$("#move_n").text(move[0]);
	$("#move_e").text(move[1]);
	$("#move_s").text(move[2]);
	$("#move_w").text(move[3]);

}

function update_sides() {

	var sides = m_Unit.get_sides();

	$("#move_n").css('background-color',sides[0]);
	$("#move_e").css('background-color',sides[1]);
	$("#move_s").css('background-color',sides[2]);
	$("#move_w").css('background-color',sides[3]);

}

function update_unitcost(){
	m_Unit.update_cost();
	$("#unrounded_points").text(m_Unit.get_cost());
	$("#base_cost").text( ceilToNearest(m_Unit.get_cost(),50) );
}

/******************************************************************************
 * Dice functions
 ******************************************************************************/
function update_figure_dice(uuid, idx) {

	num_of_dice = m_Unit.get_figure(uuid).get_dicecount();

	// Width of the div
	var w = num_of_dice * 15;

	// Offset of the div to center it
	var o = (((w - 40) / 2) * -1) + 3;

	$("#dice_"+idx+"_"+uuid).width(w);
	$("#dice_"+idx+"_"+uuid).css('left',o);

}

function update_dicepool() {
	/*
	 * Dice and movement:
	 *
	 * 4 x 3 array
	 *	rows: red, white, blue, move
	 *  cols: remaining unplaced, sum (int), sum (natural), name/id
	 */
	var dice = m_Unit.get_dice();

	for (var x = 0; x < dice.length; x++) {

		var unplaced = Math.floor(dice[x][0] / 100);
		var sum_int  = Math.floor(dice[x][1] / 100);
		var sum_nat  = dice[x][2] / 100;
		var name     = dice[x][3];

		$("#dice_pool td#"+name+"_count").text(
				 ""+unplaced+
				"/"+sum_int+
				"/"+sum_nat.toFixed(2)
		);
		
		if (unplaced > 0) {
			$( "#dice_pool td."+name ).draggable("enable");
			$( "#dice_pool td."+name ).fadeTo(0,1);
		} else {
			$( "#dice_pool td."+name ).draggable("disable");
			$( "#dice_pool td."+name ).fadeTo(0,0.2);
		}
	}
}

/******************************************************************************
 * Local ability functions
 ******************************************************************************/
function update_figure_la(uuid, idx) {

	num_of_la = m_Unit.get_figure(uuid).get_lacount();

	// Width of the div
	var w = num_of_la * 35;

	// Offset of the div to center it
	// We probably want to use the png width to actually center this.
	var o = (((w - 35) / 2) * -1) + 8;

	$("#la_"+idx+"_"+uuid).width(w);
	$("#la_"+idx+"_"+uuid).css('left',o);

}

function update_la() {
	var la = m_Unit.get_la();

	for (var x = 0; x < la.length; x++) {

		//  cols: remaining unplaced, sum (int), sum (natural), name/id
		var unplaced	= Math.floor(la[x][0] / 100);
		var sum_int		= Math.floor(la[x][1] / 100);
		var sum_nat		= la[x][2] / 100;
		var name		= la[x][3].replace(/ /g,"-").toLowerCase();
		
		var text_val	= unplaced+"/"+sum_nat.toFixed(2);
	
		// If this item already exists ...
		if ( $("img#icon_"+name).length ) {
			if (sum_nat > 0) {
				// Then just update it's text.
				$("span#text_"+name).text(text_val);
			}

		} else {
			// We need to create an icon and text, too.		

			var content = "";
			content += "<div>";
			content += "<img class='la_pool' id='icon_"+name+"' src='res/special_abilities/lsa-"+name+".png' />";
			content += "<span id='text_"+name+"'>"+text_val+"</span>";
			content += "</div>";
			$("#local_ability_pool").append(content);

			$("img#icon_"+name).draggable({
				revert: true,
				helper: "clone",
				zIndex: 2700
			});

		}
		
		if ( (unplaced) > 0 ) {
			$("img#icon_"+name).fadeTo(0,1);
			$("img#icon_"+name).draggable("enable");
		} else {
			$("img#icon_"+name).fadeTo(0,0.2);
			$("img#icon_"+name).draggable("disable");
		}
	}
}

/******************************************************************************
 * Global ability functions
 ******************************************************************************/
function update_ga() {

	var ga = m_Unit.get_ga();
	var fcount = m_Unit.get_figurecount();
	
	$("#global_ability_pool").empty();
	$("#ga_base_pool").empty();

	for (var x = 0; x < ga.length; x++) {

		var gname = ga[x][0].replace(" ","-").toLowerCase();
		var gcount = ga[x][1];

		var content = ""
		content += "<div>";
		content += "<img id='"+gname+"' src='res/special_abilities/gsa-"+gname+".png' />";
		content += "<span>"+(gcount.toFixed(1) / 100)+"/"+fcount+"</span>";
		content += "</div>";

		$("#global_ability_pool").append(content);

		var ga_img = $("<img class='base_info' id='"+gname+"_base' src='res/special_abilities/gsa-"+gname+".png' />");
		
		if ( (gcount / fcount) >= 100 ) {
			$("img#"+gname).fadeTo(0,1);
			ga_img.appendTo("#ga_base_pool");
		} else {
			$("img#"+gname).fadeTo(0,0.2);
			$("img#"+gname+"_base").remove();
		}
	}
}
