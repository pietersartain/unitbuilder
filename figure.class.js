function Figure(uuid, idx, figure){

	this.uuid	= uuid; // UUID of the div I'm attached to
	this.idx	= idx; // index of the main figure array that I was created from
	this.figure = figure; // Complete figure reference from the main array
	
	// Dice attached to this figure
	this.red	= [];
	this.white	= [];
	this.blue	= [];
	this.move	= [];

	this.add_dice = function(type,uuid) {
		switch(type){
			case "red":		this.red[this.red.length] = uuid;		break;
			case "white":	this.white[this.white.length] = uuid;	break;
			case "blue":	this.blue[this.blue.length] = uuid;	break;
			case "move":	this.move[this.move.length] = uuid;	break;
		}
	}
	
	this.rm_dice = function(type) {
		switch(type){
			case "red":		this.red.splice(this.red.length-1,1);		break;
			case "white":	this.white.splice(this.white.length-1,1);	break;
			case "blue":	this.blue.splice(this.blue.length-1,1);	break;
			case "move":	this.move.splice(this.move.length-1,1);	break;
		}
	}

	this.get_dice = function(type) {
		switch(type){
			case "red":		return this.red.length;	break;
			case "white":	return this.white.length;	break;
			case "blue":	return this.blue.length;	break;
			case "move":	return this.move.length;	break;
		}
	}
	
	this.get_dice_uuid = function(type, idx) {
		switch(type){
			case "red":		return this.red[idx];	break;
			case "white":	return this.white[idx];	break;
			case "blue":	return this.blue[idx];	break;
			case "move":	return this.move[idx];	break;
		}
	}

	this.get_dicecount = function() {
		return (this.red.length + this.white.length + this.blue.length + this.move.length);
	}
	
	this.get_uuid = function(){ return this.uuid; }
	
	this.get_idx = function(){ return this.idx; }
	
	this.get_figure = function(){ return this.figure; }

}