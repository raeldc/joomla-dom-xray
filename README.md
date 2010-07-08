What is Joomla! DOM X-Ray
=================

Latest Release is **DOM X-Ray Version 0.1 (Prototype)**

For now, only the XPath Bar is working. The Inspector(where you'll see the identifier occurances) doesn't work yet. 

DOM X-Ray is a Joomla 1.6 DOM scanning/debugging tool. It is installed as a plugin and is triggered by Joomla "onBeforeRender".
It works almost similar to CSSEdit's X-Ray but it doesn't show the location of the Element Identifiers in the CSS files. (Use Firebug/Webkit Inspector for those purposes)
Instead it shows you the URLs where the Element Identifiers appeared throughout Joomla. 

As you go from page to page, X-Ray learns the URLs in which the indentifiers are found. 
The Inspector will show those recorded URLs. Each Joomla template will have different records.

Installation
------------

*Note: Use only on Production servers(localhost). Never use this live!*

* Download the Plugin
* Install in Joomla 1.6
* Enable the Plugin
* Visit the frontend of your Joomla site. 
* If you want to scan the DOM, switch X-Ray on using the button on the Top Left corner.

Known Issues
------------

* The XPath bar on top doesn't scroll. Deep nested DOMs beyond the browser window will not show. Will work on this later.
* Not tested on IE. Works only in Firefox 3.6 and WebKit based browsers.