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
	xray_wrapper.removeEvent('click');
	
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
		.grab(
			xray.grab(xray_switch, 'top')
				.grab(domlist, 'bottom')
		, 'top');
	
	xray.getNext().setStyle('margin-top', xray.getSize().y);
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
	// Get the current element
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
					showxray(p);
					wrapelement(p);
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
	xray_wrapper.setPosition({'x': coordinates.left, 'y': coordinates.top - xray.getSize().y});
	console.log(el.getStyle('z-index'));
}