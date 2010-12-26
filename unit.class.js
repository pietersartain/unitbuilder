/******************************************************************************
 *
 *
 ******************************************************************************/

function Unit(max_figures){

/******************************************************************************
 * Member variables and initialisation
 ******************************************************************************/

	this.figures = [];
	this.max_figures = max_figures;
	this.faction = -1;
	this.unit_cost = 0;
	
	this.pegs = 0;

	/*
	 * Dice and movement:
	 *
	 * 4 x 3 array
	 *	rows: red, white, blue, move
	 *  cols: remaining unplaced, sum (int), sum (natural), name/id
	 */
	this.dice = new Array(4);
	for (var x = 0; x < 4; x++) {
		this.dice[x] = new Array(4);
		
		// Initialise the integer values
		for (var y = 0; y < 3; y++) {
			this.dice[x][y] = 0;
		}
	};
	
	// Initialise the string values
	this.dice[0][3] = "red";
	this.dice[1][3] = "white";
	this.dice[2][3] = "blue";
	this.dice[3][3] = "move";
	
	// Build a conversion table, rather than recode everything in JS
	this.dtrans = new Array(4);
	this.dtrans[0] = 2;
	this.dtrans[1] = 4;
	this.dtrans[2] = 3;
	this.dtrans[3] = 5;
	
	// Local abilities: we need to know similar things as we do for dice
	// cols: remaining unplaced, sum (int), sum (natural), name/id
	this.la = [];
	
	// Global abilities: this is just a list of ability name + number.
	this.ga = [];

	// Movement grid - N E S W
	this.movement = new Array(4);

/******************************************************************************
 * Acessor methods for returning member variables and derivatives
 ******************************************************************************/

	/*
	 * Return a Figure object from a UUID
	 */
	this.get_figure = function(uuid) {
		for (var x = 0; x < this.figures.length; x++) {
			if (this.figures[x].get_uuid() == uuid)
				return this.figures[x];
		}
	}

	/*
	 * Return a Figure index from a UUID
	 */
	this.get_figure_idx = function(uuid) {
		for (var x = 0; x < this.figures.length; x++) {
			if (this.figures[x].get_uuid() == uuid)
				return x;
		}
	}
	
	/*
	 * Return the current dice pool
	 */
	this.get_dice = function() { return this.dice; }
	
	/*
	 * Return a dice idx value (for the dice pool) from a dice type string
	 */
	this.get_dice_value_from_type = function(type) {
		for (var x = 0; x < this.dice.length; x++) {
			if (this.dice[x][3] == type)
				return x;
		}
	}

	/*
	 * Return the number of figures assigned to this unit
	 */
	this.get_figure_count = function() { return this.figures.length; }
	this.get_figurecount = function() { return this.figures.length; }
	
	this.get_max_figures = function() { return this.max_figures; }
	
	this.get_pegcount = function() { return this.pegs; }
	
	this.get_movement = function() { return this.movement; }

	this.get_cost = function() { return this.unit_cost; }

	this.set_faction = function(faction) {
		switch(faction){
		case "egypt":		this.faction = 0;	break;
		case "han":			this.faction = 1;	break;
		case "rome":		this.faction = 2;	break;
		case "mercenary":	this.faction = 3;	break;
		}
	}


	/*
	 * Return the local ability array
	 */
	this.get_la = function(){ return this.la; }
	
	/*
	 * Return the global ability array
	 */
	this.get_ga = function(){ return this.ga; }

	/*
	 * Recalculate the number of pegs from scratch
	 */
	this.update_pegcount = function() {
		this.pegs = 0;
		var pegs;
		for (var x = 0; x < this.figures.length; x++) {
			pegs = this.figures[x].get_figure()[27].split("U");
			//console.log(pegs[0]);
			this.pegs += parseInt(pegs[0]);
		}
	}

/******************************************************************************
 * Dice methods
 ******************************************************************************/

	/*
	 * Add a dice of type string type with uuid Duuid to the figure with uuid Fuuid
	 */
	this.add_dice_to_figure = function(Fuuid, type, Duuid) {
		// Increment the number of dice attached on the figure
		this.get_figure(Fuuid).add_dice(type,Duuid);
		
		// Decrement the available number of dice
		this.dice[this.get_dice_value_from_type(type)][0]--;
	}

	/*
	 * Remove a dice of type string type from the figure of uuid
	 */
	this.rm_dice_from_figure = function(uuid, type) {
		// Decrement the number of dice attached on the figure
		this.get_figure(uuid).rm_dice(type);
		
		// Increment the available number of dice
		this.dice[this.get_dice_value_from_type(type)][0]++;
	}

	/*
	 * Reparse the number of dice on this unit
	 */
	this.update_dice = function(figure) {
	
		// Use the ID to reference the js lookup table
		var ldice = new Array(4);

		// Loop through adding the new dice values they bring to the table
		// 0: remaining unplaced
		// 1: sum (int)
		// 2: sum (natural)
		for (var x = 0; x < 4; x++) {
			
			ldice[x] = parseFloat(figure[this.dtrans[x]]);
			
			// New val - recalculated from the raw figure array based on the addition
			// of the new figure.
			var av = 0;
			for (var y = 0; y < this.figures.length; y++) {
				av += parseFloat(this.figures[y].get_figure()[this.dtrans[x]]);
			}

			// The move dice
			if (x == 3){
		
				if (this.figures.length > 0) {
					av = av / this.figures.length;
				} else {
					av = 0;
				}
			}
			
			var new_val = av;
			var old_val = this.dice[x][2];
	
			// Natural sum of the dice
			this.dice[x][2] = new_val;
			
			
			if (x == 3) {	
				// For move dice
				
				var int_diff = Math.round(new_val) - Math.round(old_val);
				
				// The integer equivalent sum
				this.dice[x][1] = Math.round(this.dice[x][2]);

				// The remaining unplaced dice
				this.dice[x][0] = Math.round(this.dice[x][0] + int_diff);

			} else {
				// For everyone else
				
				var int_diff = Math.floor(new_val) - Math.floor(old_val);
				
				// The integer equivalent sum
				this.dice[x][1] = Math.floor(this.dice[x][2]);

				// The remaining unplaced dice
				this.dice[x][0] = Math.floor(this.dice[x][0] + int_diff);
			}
		


			// If the remaining unplaced dice is actually less than 0, we have some illegal dice
			if (this.dice[x][0] < 0) {
			
				var done = false;
			
				var dice_type = this.dice[x][3];
			
				// Spin through all the figures looking for a particular type of dice
				for (var y = 0; y < this.figures.length; y++) {
					
						var dice_count = this.figures[y].get_dice(dice_type);
					
						// Spin through each dice type
						for (var z = 0; z < dice_count; z++) {
							
							// Get the UUID of the dice
							var Duuid = this.figures[y].get_dice_uuid(dice_type,z);
							
							// Get the UUID and idx of the base
							var Fuuid = this.figures[y].get_uuid();
							var idx = this.figures[y].get_idx();
							
							// Actually kill off the DOM element
							$("#icon_"+idx+"_"+Fuuid+"_"+Duuid).remove();
							
							// Decrement the number of dice attached on the figure
							this.figures[y].rm_dice(dice_type);
							
							// Resize the UI
							update_figure_dice(Fuuid, idx);

							// Increment the available number of dice
							this.dice[x][0]++;
							
							// If we're done, call it a day
							if (this.dice[x][0] >= 0) {
								done = true;
								return;
							}

						} // for

					if (done) return;
				
				} // for

			} // if
		}
	}

/******************************************************************************
 * Figure (miniature) methods
 ******************************************************************************/

	/*
	 * Add a new figure to this unit
	 */
	this.add_figure = function(uuid,idx,figure) {
		
		// Add a new figure
		this.figures[this.figures.length] = new Figure(uuid,idx,figure);
		
		this.update_pegcount();
		
		// Update the dice pool availability
		this.update_dice(figure);
		
		// Update the global abilities
		this.update_ga();
		
		// Update the local abilities
		this.update_la(figure);
		
		this.update_movement();
		
		this.update_cost();
	}

	/*
	 * Remove an existing figure from this unit, based on UUI
	 */
	this.rm_figure = function(uuid) {
	
		var lfig = this.get_figure(uuid);
	
		// Remove all the dice, refunding their values
		// For each dice type
		for (var x = 0; x < this.dice.length; x++) {
		
			dcnt = lfig.get_dice(this.dice[x][3]);
		
			// For each dice of that type
			for (var y = 0; y < dcnt; y++) {
			
				// Decrement the number of dice attached on the figure
				lfig.rm_dice(this.dice[x][3]);
		
				// Increment the available number of dice
				this.dice[x][0]++;
			}
		}

		// Then find the details of the figure we're about to remove
		var figure = lfig.get_figure();

		// Kill it from the model
		this.figures.splice(this.get_figure_idx(uuid),1);

		// Finally, update the UI to reflect the changes
		this.update_dice(figure);

		// Update the global abilities
		this.update_ga();
		
		// Update the local abilities
		this.update_la(figure);
		
		this.update_pegcount();
		
		this.update_movement();
		
		this.update_cost();
		
	}

/******************************************************************************
 * Local Ability methods
 ******************************************************************************/

	/*
	 * Attach an LA by name/UUID to a figure of Fuuid
	 */
	this.add_la_to_figure = function(Fuuid, name, Luuid) {
		// Attach a LA to a figure by UUID of figure and UUID of LA.
		this.get_figure(Fuuid).add_la(Luuid);

		var la_idx = this.get_la_idx_from_name(name);

		// Decrement the available LA counter
		this.la[la_idx][0]--;
	}

	/*
	 * Remove an LA by UUID from figure Fuuid
	 */
	this.rm_la_from_figure = function(Fuuid, name, Luuid) {
		//
		this.get_figure(Fuuid).rm_la(Luuid);

		var la_idx = this.get_la_idx_from_name(name);

		// Increment the available LA counter
		this.la[la_idx][0]++;
	}

	/*
	 * Return the idx of the this.la array that contains the name of the LA.
	 */
	this.get_la_idx_from_name = function(name) {
		for (var x = 0; x < this.la.length; x++) {
			if (this.la[x][4] == name) {
				return x;
			}
		}
		return -1;
	}
	
	/*
	 *
	 */
	this.figure_has_la = function(Fuuid, la_name) {
		for (var x = 6; x < 10; x=x+2) {
			var chkname = this.get_figure(Fuuid).get_figure()[x].replace(/ /g,"-").toLowerCase();
			if (chkname == la_name) return true;
		}
		return false;
	}

	/*
	 * Reparse the number of dice on this unit
	 */
	this.update_la = function(figure) {
	
		// Whatever we do, we need to do it twice because of the two available
		// slots for local abilities.
		for (var x = 6; x < 10; x=x+2) {
			// Only procede if there's something here
			if (figure[x] != "") {
			
				var newla = true;
				var remlist = [];
			
				// Do we already have a LA of this type?			
				for (var y = 0; y < this.la.length; y++) {
					
					// If we do, then we should do something about it ...
					var unit_la_name = this.la[y][3];
					var fig_la_name = figure[x];
					
					if (unit_la_name == fig_la_name) {
					
						var old_val = this.la[y][2];
						
						// Spin through every figure we have and sum up the LAs
						// of this type.
						var new_val = 0;
						for (var z = 0; z < this.figures.length; z++) {
							for (var w = 6; w < 10; w=w+2) {
								// Only procede if there's something here
								
								var gen_la_name = this.figures[z].get_figure()[w];
								
								if (gen_la_name == fig_la_name) {
									new_val += parseFloat(figure[w+1]);
								}
							}
						}
					
						var int_diff = Math.floor(new_val) - Math.floor(old_val);

						// this.la[y][3] // The name should never need altering
						this.la[y][2] = new_val; 		// sum natural
						this.la[y][1] = Math.floor(this.la[y][2]);	// sum int
						this.la[y][0] += int_diff;

						if ( this.la[y][2] <= 0 ) {
							// We need actually need to subtract some icons
							remlist.push(y);
						}

						newla = false;
						break;
					}
				}
				
				if (remlist.length) {
					for (var y = 0; y < remlist.length; y++) {
						
						var name = this.la[y][4];
						
						// Kill off the view parts
						$("img#icon_"+name).remove();
						$("span#text_"+name).remove();

						// Then kill off the model
						this.la.splice(y,1);
					}
				}
				
				// We don't already have one of these, so let's add it to the list
				// and instantiate the default values.
				if (newla) {
					var len = this.la.length;
					//  cols: remaining unplaced, sum (int), sum (natural), name/id
					this.la[len] = new Array(5);

					this.la[len][4] = figure[x].replace(/ /g,"-").toLowerCase(); // Sanitised name
					this.la[len][3] = figure[x];					// LA name
					this.la[len][2] = parseFloat(figure[x+1]);		// sum natural
					this.la[len][1] = Math.floor(this.la[len][2]);	// sum int
					
					this.la[len][0] = this.la[len][1];				// remaining dice
				}

			} // if figure[x] != ""
		} // For each LA

		// Having hacked about with the numbers, update the UI
		update_la();
	
	} // end function

/******************************************************************************
 * Global Ability methods
 ******************************************************************************/

	/*
	 * Recalculate the GA costs from scratch
	 */
	this.update_ga = function() {

		// Clear it all, make a fresh start.
		this.ga = [];

		for(var z = 0; z < this.figures.length; z++) {
			figure = this.figures[z].get_figure();

			for (var x = 10; x < 13; x=x+2) {
				if (figure[x] != "") {
	
					var newga = true;
			
					// Do we already have a GA of this type?			
					for (var y = 0; y < this.ga.length; y++) {
						if (this.ga[y][0] == figure[x]) {
						
							//if (addrm == 'add') {
								this.ga[y][1] += parseFloat(figure[x+1]);
							//} else {
							//	this.ga[y][1] -= parseFloat(figure[x+1]);
							//}
						
							newga = false;
						}
					}
					
					// New GA
					if (newga) {
						this.ga[this.ga.length] = new Array(2);
						this.ga[this.ga.length-1][0] = figure[x];	// GA name
						this.ga[this.ga.length-1][1] = parseFloat(figure[x+1]);	// GA amount
					}			
				} // if
			} // for
		} // for
		
		// Having hacked about with the numbers, update the UI
		update_ga();
		
	} // end function	

/******************************************************************************
 * Movement Grid methods
 ******************************************************************************/

	/*
	 *
	 */
	this.update_movement = function() {
	
		for (var y = 0; y < this.movement.length; y++) {			
			
			this.movement[y] = 0;
			
			for (var x = 0; x < this.figures.length; x++) {
				this.movement[y] += parseInt(this.figures[x].get_figure()[18+y]);
			}
			
			if (this.figures.length)
				this.movement[y] = Math.round(this.movement[y] / this.figures.length);

		}
	}

/******************************************************************************
 * Bad Side Grid methods
 ******************************************************************************/


/******************************************************************************
 * Unit Cost Grid methods
 ******************************************************************************/

	/*
	 *
	 */
	 this.update_cost = function() {
	 	 
	 	this.unit_cost = 0;
	 	
		for (var x = 0; x < this.figures.length; x++) {
		
			var cost = this.figures[x].get_figure()[14+this.faction];
		
			this.unit_cost += parseInt(cost);
		}
	 
	 }

} // End class