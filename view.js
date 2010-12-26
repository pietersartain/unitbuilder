function reset_all() {

	$("#drop_area div.base").remove();		// Clear any placed figures
	update_dicepool(m_Unit.get_dice());		// Reload the values from the m_Unit
	//update_la();
	$("#local_ability_pool").empty();		// update_la() doesn't work so well. Banish the LAs.
	update_ga();							// Banish the GAs
	update_basehp();						// Reload the base HP values

}

function update_dicepool(dice) {
	for (var x = 0; x < dice.length; x++) {

		$("#dice_pool td#"+dice[x][3]+"_count").text(
				 ""+dice[x][0]+
				"/"+dice[x][1]+
				"/"+dice[x][2].toFixed(2)
		);
		
		if (dice[x][0] > 0) {
			$( "#dice_pool td."+dice[x][3] ).draggable("enable");
			$( "#dice_pool td."+dice[x][3] ).fadeTo(0,1);
		} else {
			$( "#dice_pool td."+dice[x][3] ).draggable("disable");
			$( "#dice_pool td."+dice[x][3] ).fadeTo(0,0.2);
		}
	}
}

function update_la() {
	var la = m_Unit.get_la();

	for (var x = 0; x < la.length; x++) {

		//  cols: remaining unplaced, sum (int), sum (natural), name/id
		var unplaced	= la[x][0];
		var sum_int		= la[x][1];
		var sum_nat		= la[x][2];
		var name		= la[x][3].replace(/ /g,"-").toLowerCase();
		
		var text_val	= unplaced+"/"+sum_int.toFixed(0)+"/"+sum_nat.toFixed(2);
	
		// If this item already exists ...
		if ( $("img#icon_"+name).length ) {
			if (sum_nat > 0) {
				// Then just update it's text.
				$("span#text_"+name).text(text_val);
			}

		} else {
			// We need to create an icon and text, too.		

			$("<img class='la_pool' id='icon_"+name+"' src='res/special_abilities/lsa-"+name+".png' />").appendTo("#local_ability_pool");
			$("img#icon_"+name).draggable({
				revert: true,
				helper: "clone",
				zIndex: 2700
			});

			$("<span id='text_"+name+"'>"+text_val+"</span>").appendTo("#local_ability_pool");
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

function update_figure_dice(uuid, idx) {

	num_of_dice = m_Unit.get_figure(uuid).get_dicecount();

	// Width of the div
	var w = num_of_dice * 15;

	// Offset of the div to center it
	var o = (((w - 40) / 2) * -1) + 3;

	$("#dice_"+idx+"_"+uuid).width(w);
	$("#dice_"+idx+"_"+uuid).css('left',o);

}

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

function update_ga() {

	var ga = m_Unit.get_ga();
	var fcount = m_Unit.get_figurecount();
	
	$("#global_ability_pool").empty();

	for (var x = 0; x < ga.length; x++) {

		var gname = ga[x][0].replace(" ","-").toLowerCase();  // str_replace(" ","-",strtolower($ability))
		var gcount = ga[x][1];

		$("<img id='"+gname+"' src='res/special_abilities/gsa-"+gname+".png' />").appendTo("#global_ability_pool");
		$("<span>"+gcount.toFixed(1)+"/"+fcount+"</span>").appendTo("#global_ability_pool");
		
		if ( (gcount / fcount) >= 1 ) {
			$("img#"+gname).fadeTo(0,1);
		} else {
			$("img#"+gname).fadeTo(0,0.2);
		}
	}
}

function update_basehp() {
	$("#base_hp").empty();
	$("<span>"+m_Unit.get_pegcount()+"/"+m_Unit.get_max_figures()+"</span>").appendTo("#base_hp");
}

function update_movement() {

	var move = m_Unit.get_movement();

	$("#move_n").text(move[0]);
	$("#move_e").text(move[1]);
	$("#move_s").text(move[2]);
	$("#move_w").text(move[3]);

}

function update_unitcost(){
	$("#unit_cost").text(m_Unit.get_cost());
}