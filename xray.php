<?php defined('_JEXEC') or die;

jimport('joomla.plugin.plugin');

class plgSystemXray extends JPlugin
{
	function onBeforeRender()
	{
		JFactory::getDocument()->addScript('media/plg_xray/xray.js');
		JFactory::getDocument()->addStyleSheet('media/plg_xray/xray.css');
	}
}
