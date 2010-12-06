function Unit(max_figures){

	this.figures = [];
	this.max_figures = max_figures;

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
	
	this.dtrans = new Array(4);
	this.dtrans[0] = 2;
	this.dtrans[1] = 4;
	this.dtrans[2] = 3;
	this.dtrans[3] = 5;
	
	/* Local abilities */
	this.la = new Array(2);
	this.la[0] = new Array(3);
	this.la[1] = new Array(3);
	
	/* Global abilities */
	this.ga = new Array(2);
	this.ga[0] = new Array(3);
	this.ga[1] = new Array(3);
	
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
	
	this.get_dice = function() { return this.dice; }
	
	this.get_dice_value_from_type = function(type) {
		for (var x = 0; x < this.dice.length; x++) {
			if (this.dice[x][3] == type)
				return x;
		}
	}
	
	this.add_dice_to_figure = function(Fuuid, type, Duuid) {
		// Increment the number of dice attached on the figure
		this.get_figure(Fuuid).add_dice(type,Duuid);
		
		// Decrement the available number of dice
		this.dice[this.get_dice_value_from_type(type)][0]--;
	}
	
	this.rm_dice_from_figure = function(uuid, type) {
		// Decrement the number of dice attached on the figure
		this.get_figure(uuid).rm_dice(type);
		
		// Increment the available number of dice
		this.dice[this.get_dice_value_from_type(type)][0]++;
	}
	
	/*
	 * Return the number of figures assigned to this unit
	 */
	this.get_figure_count = function() { return this.figures.length; }
	
	/*
	 * Add a new figure to this unit
	 */
	this.add_figure = function(uuid,idx,figure) {
		
		// Add a new figure
		this.figures[this.figures.length] = new Figure(uuid,idx,figure);
		this.update_dice('add',figure);
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
		this.update_dice('rm',figure);
		
	}

	/*
	 * Reparse the number of dice on this unit
	 */
	this.update_dice = function(addrm, figure) {
	
		// Use the ID to reference the js lookup table
		var ldice = new Array(4);
		
		//ldice[0] = parseFloat(figure[2]); // red
		//ldice[1] = parseFloat(figure[4]); // white
		//ldice[2] = parseFloat(figure[3]); // blue
		//ldice[3] = parseFloat(figure[5]); // move
		
		// Loop through adding the new dice values they bring to the table
		// 0: remaining unplaced
		// 1: sum (int)
		// 2: sum (natural)
		for (var x = 0; x < 4; x++) {
			
			ldice[x] = parseFloat(figure[this.dtrans[x]]);
			
			var av = 0;
			for (var y = 0; y < this.figures.length; y++) {
				av += parseFloat(this.figures[y].get_figure()[this.dtrans[x]]);
			}

			if (x == 3){
		
				if (this.figures.length > 0) {
					av = av / this.figures.length;
				} else {
					av = 0;
				}
			}
			
				var new_val = av;

			/*
			} else {
				if (addrm == 'add') {
					var new_val = this.dice[x][2] + ldice[x];
				} else {
					var new_val = this.dice[x][2] - ldice[x];
				}
			}
			*/
			
			var old_val = this.dice[x][2];

			var int_diff = Math.floor(new_val) - Math.floor(old_val);
	
			// Natural sum of the dice
			this.dice[x][2] = new_val;
			
			// The integer equivalent sum
			this.dice[x][1] = Math.floor(this.dice[x][2]);
		
			// The remaining unplaced dice
			this.dice[x][0] = Math.floor(this.dice[x][0] + int_diff);
			
			
			
			// Have we reduced the amount of dice available?
			//if (int_diff < 0) {
				// Having established that, have we got too many dice placed?
			//	if
			//}
			
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

	
}