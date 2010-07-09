<?php defined('_JEXEC') or die;

jimport('joomla.plugin.plugin');

class plgSystemXray extends JPlugin
{
	function onBeforeRender()
	{
		// Use only for site.
		if (JFactory::getApplication()->isAdmin()) 
		{
			return;
		}
		
		if (JRequest::getVar('xray-command') == 'identify') 
		{
			$html = '';
			$identifiers = array();
			
			$db = JFactory::getDbo();
			$post = JRequest::get('post');
			
			if (isset($post['id'])) 
			{
				// Get a new query builder
				$query = $db->getQuery(TRUE);

				$query->select('*')->from('#__xray_identifiers')
					->where('`identifier` = '. $db->Quote($post['id']))
					->where('`identifier_type` = '.$db->Quote('id'));

				$db->setQuery($query);
				$result = $db->loadObjectList();
				
				$html .= $this->_parseResult($post['id'], $result);
				$identifiers[] = $post['id'];
			}
			
			if (isset($post['classes'])) 
			{
				foreach ( $post['classes'] as $class) 
				{
					// Get a new query builder
					$query = $db->getQuery(TRUE);

					$query->select('*')->from('#__xray_identifiers')
						->where('`identifier` = '. $db->Quote($class))
						->where('`identifier_type` = '.$db->Quote('class'));

					$db->setQuery($query);
					$result = $db->loadObjectList();
					$html .= $this->_parseResult($class, $result);
					$identifiers[] = $class;
				}
			}
			
			
			if ($html == '') 
			{
				$html = 'Identifiers '.implode(', ',$identifiers).' not found. Maybe it is template specific. You are using '. JFactory::getDocument()->template. '.';
			}
			
			echo $html;
			exit();
		}
		
		JHTML::_('behavior.mootools');
		JFactory::getDocument()->addScript(JURI::root().'media/plg_xray/media/xray.js');
		JFactory::getDocument()->addStyleSheet(JURI::root().'media/plg_xray/media/xray.css');

		//echo JFactory::getDocument()->template;
		//die();
	}
	
	private function _parseResult($identifier, $result)
	{
		$components = array();
		$modules = array();
		$usedfor = array();
		$tagnames = array();
		$suffix = FALSE;
		
		if ( ! $result) 
		{
			return '';
		}
		
		foreach ($result as $value) 
		{
			switch ($value->extension_type) 
			{
				case 'module':
					$modules[] = $value->extension;
				break;
				
				case 'component':
					$components[] = $value->extension;
				break;
			}
			
			if ( ! in_array($value->used_for, $usedfor)) 
			{
				$usedfor[] = $value->used_for;
			}
			
			if ( ! in_array($value->tagnames, $tagnames)) 
			{
				$tagnames[] = $value->tagnames;
			}
			
			$suffix = ($value->suffix) ? 'Yes' : 'No';
			$type = $value->identifier_type;

		}
		
		$html = '<div class="identifiers">';
		$html .= '<h3>'.$identifier.' ('.$type.')</h3>';

		if ($components) 
		{
			$html .= '<h4>Components</h4><ul>';
			foreach ($components as $component) 
			{
				$html .= '<li>'.$component.'</li>';
			}
			$html .= '</ul>';
		}
		
		if ($modules) 
		{
			$html .= '<h4>Modules</h4><ul>';
			foreach ($modules as $module) 
			{
				$html .= '<li>'.$module.'</li>';
			}
			$html .= '</ul>';

		}
		
		if ($usedfor) 
		{
			$html .= '<h4>Used For</h4><ul>';
			foreach ($usedfor as $for) 
			{
				$html .= '<li>'.$for.'</li>';
			}
			$html .= '</ul>';
		}
		
		if ($tagnames) 
		{
			$html .= '<h4>Tags</h4><ul>';
			foreach ($tagnames as $tag) 
			{
				$html .= '<li>'.htmlentities($tag).'</li>';
			}
			$html .= '</ul>';
		}
		
		$html .= '<h4>Optional Suffix - '.$suffix.'</h4>';
		$html .= '</div>';
		
		return $html;
	}
}
