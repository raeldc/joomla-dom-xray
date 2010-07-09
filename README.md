What is Joomla! DOM X-Ray
=================

Latest Release is **DOM X-Ray Version 0.2 (Unstable but Working as Planned)**

DOM X-Ray is a Joomla 1.6 DOM scanning/debugging tool. It is installed as a plugin and is triggered by Joomla "onBeforeRender".
It works almost similar to CSSEdit's X-Ray but it doesn't show the location of the Element Identifiers in the CSS files. (Use Firebug/Webkit Inspector for those purposes)

For now, the data was taken from http://rc.hrpr.com/j16. Thanks to their hard work, we can identify the default class/id outputs of Joomla!

Installation
------------

*Note: Use only on Production servers(localhost). Never use this live!*

* Download the Plugin
* Install in Joomla 1.6
* Enable the Plugin
* Import /plugins/system/xray/data.sql to your Joomla Database. (Make sure you change the prefix);
* Visit the frontend of your Joomla site. 
* If you want to scan the DOM, switch X-Ray on using the button on the Top Left corner.

Known Issues
------------

* The XPath bar on top doesn't scroll. Deep nested DOMs beyond the browser window will not show. Will work on this later.
* Not tested on IE. Works only in Firefox 3.6 and WebKit based browsers.