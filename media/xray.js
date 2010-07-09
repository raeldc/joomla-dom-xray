var domlist;
var xray;
var xray_switch;
var xray_switch_on;
var xray_wrapper;
var current_element;

window.addEvent('domready', function(){
	xray_switch_on = true;

	// Scan the dom
	document.getElement('body').getChildren().each(onclick);
	
	// Initialize the Current Element
	current_element = $(document).getElement('body');

	// Initialize the XRay bar
	xray = new Element('div', {'id': 'xray'});
	xray_wrapper = new Element('div', {'id': 'xray-wrapper'});
	xray_adjuster = new Element('div', {'id': 'xray-adjuster'});
	//xray_inspector = $('xray-inspector');

	xray_inspector = new Element('div', {'id': 'xray-inspector', 
	'html' : 	'<div class="title">Inspector</div>' +
				'<div class="content">' +
				'<div class="content-wrapper" id="xray-inspector-content">' +
				'</div></div><div class="footer"></div>'
	});
	
	
	xray_inspector.addEvent('close', function(){
		this.setStyle('display', 'none');
			$('xray-inspector-content').empty().set('html', 'Please wait...');
	});
	
	xray_wrapper.addEvent('click', function(e){
		this.setStyle('display', 'none');
		var target = findtarget(e.page, current_element);
		target.fireEvent('click', e);
	});
	
	domlist = new Element('ul');
	xray_switch = new Element('div', {
		'id': 'xray-switch',
		'text': 'ON',
		'class': 'on',
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
				xray_inspector.fireEvent('close');
			}
		}
	});
	
	// Request
	var xray_request = new Request.HTML({
		'url': 'index.php?xray-command=identify',
		'onSuccess' : function(responseTree, responseElements, responseHTML){
			$('xray-inspector-content').set('html',responseHTML);
		}
	});
	
	window.addEvent('rightclick', function(e){
		if ( ! xray_switch_on) {
			return false;
		}
		var x = e.page.x;
		var y = e.page.y;
		
		var xpath_bar = findtarget(e.page, domlist);
		if(domlist != xpath_bar) {
			xpath_bar.fireEvent('click', e);
			y = e.page.y + xray.getSize().y;
		}
		
		var data = identifiers(current_element);
		if (data.getLength()) {
			xray_inspector.setStyle('display', 'block');
			xray_inspector.setPosition({'x': x, 'y': y});
			xray_request.post(data);
		};
	});
	
	window.addEvent('contextmenu',function(e){
		if (xray_switch_on && e.rightClick) {
			var target = findtarget(e.page, $(document).getElement('body'));
			target.fireEvent('click', e);
			window.fireEvent('rightclick', e);
		}
		
		return false;
	});

	document.getElement('body')
		.grab(xray_wrapper, 'bottom')
		.grab(xray_adjuster, 'top')
		.grab(xray_inspector, 'top')
		.grab(
			xray.grab(xray_switch, 'top')
				.grab(domlist, 'bottom')
		, 'top');
		
	xray_adjuster.setStyle('height', xray.getSize().y);

});

var onclick = function(el) {
	if (el.get('id') == 'xray-inspector') {
		return;
	};
	el.addEvent('click', function(e){
		if (xray_switch_on) {
			// Empty the domlist
			domlist.empty();
			xray_inspector.fireEvent('close');
			wrapelement(el);
			showxray(el);
			e.stopPropagation();
			return false;
		};
	});
	
	el.getChildren().each(onclick);
};

var getidentifiers = function(el) {
	var tagname = el.tagName;
	
	if (el.get('id')) {
		tagname += '#'+el.get('id');
	};
	
	if (el.get('class') != '') {
		tagname += '.'+el.get('class').split(' ').join('.');
	}
	
	return tagname;
}

var identifiers = function(el) {
	var identifiers = new Hash();
	
	if (el.get('id')) {
		identifiers.set('id',el.get('id'));
	};
	
	if (el.get('class') != '') {
		identifiers.set('classes', el.get('class').split(' '));
	}
	
	return identifiers;
}

var showxray = function(el) {
	
	var tagname = getidentifiers(el);
	
	// Set as the current element
	domlist.grab(new Element('li', {
		'class': 'current', 
		'html':'<span><span>'+tagname+'</span></span>',
		'events': {
			'click': function(e) {
				wrapelement(el);
				xray_inspector.fireEvent('close');
				domlist.getChildren('li.wrapped').removeClass('wrapped');
			}
		}
	}));
	
	// Get the parent elements
	el.getParents().each(function(p){
		var tagname = getidentifiers(p);
		
		domlist.grab(new Element('li', {
			'text': tagname,
			'events': {
				// Make the xpath clickable then show the element that it refers to
				'click': function(e) {
					wrapelement(p);
					domlist.getChildren('li.wrapped').removeClass('wrapped');
					this.addClass('wrapped');
					xray_inspector.fireEvent('close');
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