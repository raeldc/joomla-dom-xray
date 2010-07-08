What is X-Ray
-------------

X-Ray is a Joomla 1.6 Template scanning/debugging tool. It is installed as a plugin and is triggered by Joomla "onBeforeRender".
When turned on, it shows you the CSS ids and classes that are on a page, and also scans where to find those identifiers in the CSS file.

As you go from page to page, X-Ray learns the pages in which the indentifiers are found. 
The Inspector will show the URLs where the current identifier is found.

Roadmap
=======

Version 1.0
-----------

* Scan the whole document. onClick shows the xpath of the clicked element.