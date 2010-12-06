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

function update_figure_dice(uuid, idx) {

	num_of_dice = Unit.get_figure(uuid).get_dicecount();

	// Width of the div
	var w = num_of_dice * 15;

	// Offset of the div to center it
	var o = (((w - 40) / 2) * -1) + 3;

	$("#dice_"+idx+"_"+uuid).width(w);
	$("#dice_"+idx+"_"+uuid).css('left',o);

}

function update_unit_cost(){}