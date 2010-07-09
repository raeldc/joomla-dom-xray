<?php defined('_JEXEC') or die;

jimport('joomla.plugin.plugin');

class plgSystemXray extends JPlugin
{
	function onBeforeRender()
	{
		// Use only for site.
		if (JFactory::getApplication()->isAdmin()) 
		{
			//return;
		}
		
		if (JRequest::getVar('xray-command') == 'identify') 
		{
			/*
			<div class="identifiers">
			<h3>identifier (class)</h3>
			<h4>Components</h4>
			<ul><li>Component 1 </li><li>Component 2</li></ul>
			<h4>Modules</h4>
			<ul><li>Component 1 </li><li>Component 2</li></ul>
			<h4>Optional Suffix - No</h4>
			<h4>Used for</h4>
			<p>category, created, last updated, published, written by</p>
			<h4>Used Tags</h4>
			<p>div, input</p>
			</div>
			
			<div class="identifiers">
			<h3>identifier (class)</h3>
			<h4>Components</h4>
			<ul><li>Component 1 </li><li>Component 2</li></ul>
			<h4>Modules</h4>
			<ul><li>Component 1 </li><li>Component 2</li></ul>
			<h4>Optional Suffix - No</h4>
			<h4>Used for</h4>
			<p>category, created, last updated, published, written by</p>
			<h4>Used Tags</h4>
			<p>div, input</p>
			</div>
			*/

			$db = JFactory::getDbo();
			$post = JRequest::get('post');
			
			foreach ( $post['identifiers'] as $key => $value) 
			{
				# code...
			}
			// Get a new query builder
			$query = $db->getQuery(TRUE);
			
			$query->select('*')->from('#__xray_identifiers')
				->where('`identifier` = '. $db->Quote($identifier))
				->where('`identifier_type` = '.$db->Quote($identifier_type));

			$db->setQuery($query);
			
			$result = $db->loadObjectList();
			print_r($result);
			exit();
		}
		
		JHTML::_('behavior.mootools');
		JFactory::getDocument()->addScript(JURI::root().'media/plg_xray/media/xray.js');
		JFactory::getDocument()->addStyleSheet(JURI::root().'media/plg_xray/media/xray.css');

		//echo JFactory::getDocument()->template;
		//die();
	}
}
