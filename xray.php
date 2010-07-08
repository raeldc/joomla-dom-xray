<?php defined('_JEXEC') or die;

jimport('joomla.plugin.plugin');

class plgSystemXray extends JPlugin
{
	function onBeforeRender()
	{
		JHTML::_('behavior.mootools');
		JFactory::getDocument()->addScript('media/plg_xray/media/xray.js');
		JFactory::getDocument()->addStyleSheet('media/plg_xray/media/xray.css');
	}
}
