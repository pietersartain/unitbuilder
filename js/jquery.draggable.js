$.fn.draggable = function(options) {
	options = $.extend({
		distance: 0,
		draggingClass: "dragging"
	}, options);

	var offset, margins, startPos, downEvt, helper, passedDistance, dropTargets, currentDropTarget, draggable, tmpOpts = [];
	
	$(this).live("mousedown.draggable", function(e) {
		if($(this).hasClass(options.draggingClass) || (helper && passedDistance) || e.metaKey || e.shiftKey || e.ctrlKey) return;
		
		draggable = $(this);
		
		margins = {
			left: (parseInt(draggable.css("marginLeft"), 10) || 0),
			top: (parseInt(draggable.css("marginTop"), 10) || 0)
		};
		
		offset = draggable.offset();
		offset = { top: e.pageY - offset.top + margins.top, left: e.pageX - offset.left + margins.left };
		
		if($.isFunction(options.helper)) {
			helper = options.helper.call(draggable, function(option, value) {
				options[option] = value;
				tmpOpts.push(option);
			});
			if(!helper) throw("DOM node not returned from helper function");
		}
		else {
			helper = draggable.clone();
		}
		
		helper.addClass(options.draggingClass).css({ 
			position: "absolute"
		});
		
		startPos = {
			top: e.pageY - offset.top + "px",
			left: e.pageX - offset.left + "px"
		};
		
		$(document).bind("mousemove.draggable", drag).bind("mouseup.draggable", dragup);
		
		//cache drop target positions
		dropTargets = [];
		var targets = $.dd.targets.join(",");
		if(targets.length > 0) {
			$(targets).each(function(i) {
				var self = $(this);
				var opts = self.data("drop_options");
				if(opts.accept && !draggable.is(opts.accept)) return; //only include drop targets that accept this element
				
				var o = self.offset();
				dropTargets.push({
					x: o.left,
					y: o.top,
					width: self.outerWidth(),
					height: self.outerHeight(),
					el: self,
					index: i,
					options: opts
				});
			});
		}
		
		downEvt = e;
		e.preventDefault();
	});
	
	function drag(e) {
		if(!passedDistance) {
			if(Math.max(Math.abs(downEvt.pageX - e.pageX),
						Math.abs(downEvt.pageY - e.pageY)) >= options.distance) {
				passedDistance = true;
				if(options.cursorAt) {
					if(options.cursorAt.top) offset.top = options.cursorAt.top + margins.top;
					if(options.cursorAt.left) offset.left = options.cursorAt.left + margins.left;
				}
				helper.appendTo("body");
			}
			else return;
		}
	
		helper.css({
			top: e.pageY - offset.top + "px",
			left: e.pageX - offset.left + "px"
		});
		
		//check if we are still over the current drop target
		if(currentDropTarget) {
			var cur = currentDropTarget;
			if(!(e.pageX > cur.x && e.pageX < cur.x + cur.width &&
			   e.pageY > cur.y && e.pageY < cur.y + cur.height)) {
			    cur.el.removeClass(cur.options.hoverClass);
				currentDropTarget = false;
				return;
			}
		}		
		
		$.each(dropTargets, function(i) {
			if(e.pageX > this.x && e.pageX < this.x + this.width &&
			  (e.pageY > this.y && e.pageY < this.y + this.height)) {
			   
			   currentDropTarget = this;
			   this.el.addClass(currentDropTarget.options.hoverClass);
			   return false;
		    }
		});
	}
	
	function dragup(e) {
		$(document).unbind("mousemove.draggable", drag).unbind("mouseup.draggable", dragup);
		
		if(currentDropTarget) {
			helper.remove();
			currentDropTarget.el.removeClass(currentDropTarget.options.hoverClass);
			if($.isFunction(currentDropTarget.options.drop)) {
				currentDropTarget.options.drop.call(currentDropTarget.el, {
					helper: helper,
					draggable: draggable,
					position: { x: e.pageX, y: e.pageY }
				});
			}
				
			cleanUpVars();
		}
		else {
			helper.animate(startPos, function() {
				$(this).remove();
			});
			cleanUpVars();
		}
	}
	
	function cleanUpVars() {
		$.each(tmpOpts, function() {
			delete options[this];
		});
		tmpOpts = [];
		offset = margins = startPos = downEvt = helper = passedDistance = dropTargets = currentDropTarget = draggable = null;
	}
	
	//Prevent text selection in IE
	if ($.browser.msie) {
		$(this).attr('unselectable', 'on');
	}
	
	return this;
};

$.fn.droppable = function(options) {
	options = $.extend({
		hoverClass: 'draghovered'
	}, options);
	
	var self = $(this);
	
	self.data("drop_options", options);
	$.dd.targets.push(this.selector); //must use a selector
	
	return this;
};

$.dd = {
	targets: []
};