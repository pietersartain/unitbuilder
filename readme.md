# Open Legions Unit Builder

The intention of this code was originally to allow an open platform to build replacement or alternative unit cards for the ruleset devised by Wells Expeditions for their game Arcane Legions. Since Wells Expeditions closed their doors in 2012, I am dedicating my coding efforts on this project to making a true alternative to their hosted Unit Creator, which may or may not ever see the light of day again.

While this may never be a feature-complete replacement, it should be sufficient to still enjoy the creation and printing of units for Arcane Legions.

## Live Demo

http://unitbuilder-4dzgxkwr.dotcloud.com/

### Usage

 * Select the faction and base type you want.
 * Drag & drop a figure from the left list onto the base.
 * Drag & drop icons from the bottom right onto a figure on the base (only non-greyed items are draggable).
 * Drag & drop either an icon off the figure, or a figure off the base, to "delete" it from the unit.
 * Right click a base to convert it to a secondary figure.

#### Gotchas
 * To allow regrouping on Commander (gold) figures, make the Commander to a secondary figure by right clicking it before adding it again.
 * When switching from landscape to portrait modes, the figures will pivot on the top-left peg.
 
## Hosting the Unit Builder

The simplest way:
 * Download this repository (as a tarball or zipfile or similar)
 * Open content/index.html in a browser
 * Enjoy!

### Compiling
If you need to make a change to the html file, the CSS or the figure list, you will need to regenerate the html. This is done by executing make in the base directory. You will need:

 * Make
 * ruby 1.9.3+
 * compass
 * Command line php

This is easy enough to do on Linux and OSX. If you're stuck with Windows and need to do this, I recommend using a Linux virtual machine and saving yourself a ton of pain.

## Todo

 * Check printable-ness.
 * Inline instructions for use.

### Feature complete
 * Place dice and local ability icons on the top or bottom of the figure (currently dice go top, abilities on the bottom).
 * Proper figure blocking and collision detection.
 * Proper background graphics for the unit cards.
 * Save/restore created bases.

### Nice to have
 * Better Commander handling.
 * Allow skinning / configuration-based rulesets to build new games and modify existing rules.

### Done
 * Correct figure local ability placement (ie: can only be placed on the figure with that LA available).
 * Correct maximum icons per peg.
 * Faction limitations on figure placement (results in NaN error for unit cost).
 * Unit naming.
 * Rotate the figure bases as well as the movement grid.
 * Extra figure slots for regrouping.
 * Printable units.
 * Easy local hosting.
 * Round the figure points to nearest 50.

## Copyright & Licensing

Arcane Legions is copyright Wells Expeditions 2010-2012. All figures, names, fiction and so on are trademark their respective owners.

jquery is made available under the GPL v2 and is included in this source tree for convenience. See http://jquery.org/license for details.

The code is Copyright 2010-2013 Pieter E Sartain, and released under the GPL v2 license. See license.txt document for details.

Where I've pilfered code from somewhere else, I've linked the reference, but mostly it's my own work.

Basically, I wrote this and want to keep it freely available. Think of it as a piece of fan work, where immitation is the greatest form of flattery.