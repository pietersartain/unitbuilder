function Figure(uuid, idx, figure){

	this.uuid	= uuid; // UUID of the div
	this.idx	= idx; // index of the main figure array
	this.figure = figure; // Complete figure reference from the main array
	
	// Dice attached to this figure
	this.red	= 0;
	this.white	= 0;
	this.blue	= 0;
	this.move	= 0;

	this.add_dice = function(type) {
		switch(type){
			case "red":		this.red++;		break;
			case "white":	this.white++;	break;
			case "blue":	this.blue++;	break;
			case "move":	this.move++;	break;
		}
	}
	
	this.rm_dice = function(type) {
		switch(type){
			case "red":		this.red--;		break;
			case "white":	this.white--;	break;
			case "blue":	this.blue--;	break;
			case "move":	this.move--;	break;
		}
	}

	this.get_dice = function(type) {
		switch(type){
			case "red":		return this.red;	break;
			case "white":	return this.white;	break;
			case "blue":	return this.blue;	break;
			case "move":	return this.move;	break;
		}
	}
	
	this.get_dicecount = function(){ return (this.red + this.white + this.blue + this.move); }
	
	this.get_uuid = function(){ return this.uuid; }

}