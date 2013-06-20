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
 * functions.js
 *
 * Generic js functions
 ******************************************************************************/
 
/*
 * Generate a UUID
 * 
 * Code copyright broofa
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
 */
function newID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();
}

/*
 * http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric/1830844#1830844
 */
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
 *
 */
function roundToNearest(number, nearest) {

    number = Math.round(number);
    var retval = 0;

    if(nearest > number || nearest <= 0) {
        retval = number;
    }
 
    var x = ( number % nearest );
     
    if ( x < (nearest/2) ) {
        retval = number - x;
    } else {
        retval = number + (nearest-x);
    }
     
    return retval;
}

/*
 *
 */
function ceilToNearest(number, nearest) {
    return ( nearest * Math.ceil(number / nearest) );
}

function floorToNearest(number, nearest) {
    return ( nearest * Math.floor(number / nearest) );
}