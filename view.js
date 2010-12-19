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
	var la = Unit.get_la();
	//var fcount = Unit.get_figurecount();
	
	$("#local_ability_pool").empty();

	for (var x = 0; x < la.length; x++) {
	
		//  cols: remaining unplaced, sum (int), sum (natural), name/id
		
		var unplaced	= la[x][0];
		var sum_int		= la[x][1];
		var sum_nat		= la[x][2];
		var name		= la[x][3].replace(/ /g,"-").toLowerCase();  // str_replace(" ","-",strtolower($ability))

		$("<img class='la_pool' id='"+name+"' src='res/special_abilities/lsa-"+name+".png' />").appendTo("#local_ability_pool");
		$("<span>"+unplaced+"/"+sum_int.toFixed(0)+"/"+sum_nat.toFixed(2)+"</span>").appendTo("#local_ability_pool");
		
		if ( (unplaced) > 0 ) {
			$("img#"+name).fadeTo(0,1);
			$("img#"+name).draggable("enable");
		} else {
			$("img#"+name).fadeTo(0,0.2);
			$("img#"+name).draggable("disable");
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

function update_ga() {

	var ga = Unit.get_ga();
	var fcount = Unit.get_figurecount();
	
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

function update_unit_cost(){}