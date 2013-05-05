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
 * figure.class.js
 *
 * The figure object.
 ******************************************************************************/


function Figure(uuid, idx, figure){

	this.uuid	     = uuid;   // UUID of the div I'm attached to
	this.idx	     = idx;    // index of the main figure array that I was created from
	this.figure    = figure; // Complete figure reference from the main array
	this.secondary = false;  // Is this a secondary slot? (ie: does it count toward the unit HP?)

	// Dice attached to this figure
	this.red	  = [];
	this.white	= [];
	this.blue	  = [];
	this.move	  = [];
	
	// Local abilities attached to this figure
	this.la		= [];

	this.add_la = function(uuid,name) {
		var idx = this.la.length;
		this.la[idx] = new Array(2);
		this.la[idx][0] = uuid;
		this.la[idx][1] = name;
	}
	
	this.rm_la = function(uuid) {
		for (var x = 0; x < this.la.length; x++) {
			if (this.la[x][0] == uuid) {
				this.la.splice(x,1);
				return;
			}
		}
	}
	
	this.get_la = function() { return this.la; }

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
	
	this.get_lacount = function() {
		return this.la.length;
	}
	
	this.get_uuid = function(){ return this.uuid; }
	
	this.get_idx = function(){ return this.idx; }
	
	this.get_figure = function(){ return this.figure; }

	this.slot_type = function(secondary) { this.secondary = secondary; }

	this.is_secondary = function() { return this.secondary; }

	this.get_iconcount = function() {
		return this.get_dicecount() + this.get_lacount();
	}

	this.get_maxicons = function() {
		switch(this.figure[27]) {
			case "1U":     return 6; break;
			case "1UB":    return 6; break;
			case "1UE":    return 6; break;
			case "2UC":    return 8; break;
			case "2ULB":   return 8; break;
			case "2UPA":   return 6; break;
			case "2UPB":   return 6; break;
			case "3U2FP":  return 8; break;
			case "3UAP":   return 8; break;
			case "3UC":    return 8; break;
			case "3UL":    return 12; break;
			case "4U":     return 8; break;
			case "4U2FP":  return 8; break;
			case "4UL":    return 16; break;
			case "4ULB":   return 12; break;
			case "4UP":    return 12; break;
		}
	}

}