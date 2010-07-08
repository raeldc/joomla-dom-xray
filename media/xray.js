var domlist;
var xray;
var xray_switch;
var xray_switch_on;
var xray_wrapper;
var current_element;

window.addEvent('domready', function(){
	xray_switch_on = false;
	
	// Scan the dom
	document.getElement('body').getChildren().each(onclick);
	
	// Initialize the Current Element
	current_element = $(document).getElement('body');

	// Initialize the XRay bar
	xray = new Element('div', {'id': 'xray'});
	xray_wrapper = new Element('div', {'id': 'xray-wrapper'});
	margin_adjuster = new Element('div', {'id': 'margin-adjuster'});

	xray_wrapper.addEvent('click', function(e){
		this.setStyle('display', 'none');
		var target = findtarget(e.page, current_element);
		target.fireEvent('click', e);
	});
	
	domlist = new Element('ul');
	xray_switch = new Element('div', {
		'id': 'xray-switch', 
		'text': 'OFF', 
		'events': {
			'click' : function(){
				if (this.get('text') == 'OFF') {
					this.addClass('on');
					this.set('text', 'ON');
					xray_switch_on = true;
				}else
				{
					this.removeClass('on');
					this.set('text', 'OFF');
					domlist.empty();
					xray_wrapper.setStyle('display', 'none');
					xray_switch_on = false;
				}
			}
		}
	});
	
	document.getElement('body')
		.grab(xray_wrapper, 'bottom')
		.grab(margin_adjuster, 'top')
		.grab(
			xray.grab(xray_switch, 'top')
				.grab(domlist, 'bottom')
		, 'top');
		
	margin_adjuster.setStyle('height', xray.getSize().y);
});

var onclick = function(el) {
	
	el.addEvent('click', function(e){
		if (xray_switch_on) {
			wrapelement(el);
			showxray(el);
			e.stopPropagation();
			return false;
		};
	});
	
	el.getChildren().each(onclick);
};

var showxray = function(el) {
	// Empty the domlist
	domlist.empty();
	
	var tagname = el.tagName;
	
	if (el.get('id')) {
		tagname += '#'+el.get('id');
	};
	
	if (el.get('class')) {
		tagname += '.'+String(el.get('class')).replace(' ', '.');
	};
	// Set as the current element
	domlist.grab(new Element('li', {
		'class': 'current', 
		'html':'<span><span>'+tagname+'</span></span>'
	}));
	
	// Get the parent elements
	el.getParents().each(function(p){
		var tagname = p.tagName;
		if (p.get('id')) {
			tagname += '#'+p.get('id');
		};
		if (p.get('class')) {
			tagname += '.'+String(p.get('class')).replace(' ', '.');
		};
		domlist.grab(new Element('li', {
			'text': tagname,
			'events': {
				// Make the xpath clickable then show the element that it refers to
				'click': function() {
					wrapelement(p);
					showxray(p);
				}
			}
		}), 'top');
	});
}

var wrapelement = function(el) {	
	var coordinates = el.getCoordinates();
	xray_wrapper.setStyles({
		'display': 'block',
		'width': coordinates.width,
		'height': coordinates.height
	});
	xray_wrapper.setPosition({'x': coordinates.left, 'y': coordinates.top});
	current_element = el;
}

// This function recursively looks for an element behind an overlapping div
//		What goes last is the best candidate as the real target.
var findtarget = function(cursor, target) {
	var children = target.getChildren();
	var realtarget = target;

	for(var i = 0; i < children.length; i++)
	{
		// This is the target that's in consideration
		var temptarget;
		
		// Let's check if this element has children
		var subchildren = children[i].getChildren();
		
		if (subchildren.length) {
			// If it has children, recursively find a target
			temptarget = findtarget(cursor, children[i]);
		}else
		{
			// If there is no children, let's consider the current element
			temptarget = children[i];
		}
		
		var coordinates = temptarget.getCoordinates();
		
		// Check if the cursor hits the target in consideration
		if (cursor.y >= coordinates.top && 
			cursor.y <= coordinates.top + coordinates.height &&
			cursor.x >= coordinates.left &&
			cursor.x <= coordinates.left + coordinates.width
		){
			realtarget = temptarget;
		};
	}
	
	return realtarget;
}