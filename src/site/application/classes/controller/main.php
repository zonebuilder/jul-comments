<?php defined('SYSPATH') or die('No direct script access.');
/*
	JUL Comment Systems (JCS) version 1.3.3
 	Copyright (c) 2015 - 2017 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-comments/
	Licenses: GNU GPL2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-designer/wiki/License/)
*/ 

/**
 * A REST server for JUL.Comments
 * @class
 */
class Controller_Main extends Controller {

	/**
	 * Delivers JCS main page
	 */
	public function action_index()
	{
		$aConfig = kohana::$config->load('main');
		$this->response->body(View::factory('main', array_merge($aConfig->as_array(), array(
			'app' => array(
				'version' => $aConfig->get('version'),
				'title' => $aConfig->get('title'),
				'config' => array(
					'zb_link' => $aConfig->get('zb_link'),
				),
			),
		))));
		if ($this->request->query()) { return; }
		$sWork = $aConfig->get('work_dir');
		foreach (array('_apps', '_projects', '_frameworks', '_examples') as $sName) {
			if (is_file(APPPATH.$sName.'.zip')) {
				$this->unzip(APPPATH.$sName.'.zip', $sWork);
				@unlink(APPPATH.$sName.'.zip');
			}
		}
	}
	
	/**
	 * Manages the HTTP REST requests. PUT and DELETE are implemented via POST.
	 */
	public function action_manage()
	{
		$aResponse = array();
		$sRequestType = $this->request->method();
		if ($sRequestType === Request::POST) {
			if (!$this->validNS($this->request->post('ns')) || $this->request->post('type') !== 'project') {
				$this->response->body('{"error":"Invalid operation"}');
				return;
			}
			$sConfigFolder = $this->request->post('type').'s';
			$sPath = Kohana::$config->load('main.work_dir').DIRECTORY_SEPARATOR.$sConfigFolder.DIRECTORY_SEPARATOR.
				str_replace('.', DIRECTORY_SEPARATOR, $this->request->post('ns'));
			$sDir = pathinfo($sPath, PATHINFO_DIRNAME);
			$sType = $this->request->post('type');
			switch ($this->request->post('operation')) {
			case 'delete':
			if (file_exists($sPath.'.json') && is_file($sPath.'.json')) {
				$bReturn = @unlink($sPath.'.json');
				if ($bReturn === false) {
					$aResponse['error'] = 'Access denied';
					break;
				}
				if ($sType === 'project') {
					@unlink($sPath.'.zip');
				}
				@rmdir($sDir);
				$aResponse['result'] = ucwords($sType).' deleted';
			}
			else {
				$aResponse['error'] = 'File not found';
			}
			break;
			case 'new':
			case 'edit':
			case 'saveCode':
			if (file_exists($sPath.'.json') && is_file($sPath.'.json') &&
				($this->request->post('operation') === 'new' || $this->request->post('old_ns') !== $this->request->post('ns'))) {
				$aResponse['error'] = 'A '.$sType.' with the same namespace already exists';
				break;
			}
			case 'save':
				if (!file_exists($sDir) || !is_dir($sDir)) {
					@mkdir($sDir, 0755, true);
				}
				if ($this->request->post('json')) {
					$bReturn = @file_put_contents($sPath.'.json', $this->request->post('json'));
					if ($bReturn === false) {
						$aResponse['error'] = 'Access denied';
						break;
					}
				}
				if ($this->request->post('code')) {
					$this->zip($sPath, $this->request->post('code'));
				}
				$aResponse['result'] = 'New file saved';
			break;
			default:
				$aResponse['error'] = 'Invalid operation.';
			}
		}
		if ($sRequestType === Request::GET) {
			if (($this->request->query('operation') !== 'browse' && !$this->validNS($this->request->query('ns'))) ||
				$this->request->query('type') !== 'project') {
				$this->response->body('{"error":"Invalid operation"}');
				return;
			}
			$sConfigFolder = $this->request->query('type').'s';
			$sPath = Kohana::$config->load('main.work_dir').DIRECTORY_SEPARATOR.$sConfigFolder;
			$sType = $this->request->query('type');
			switch ($this->request->query('operation')) {
			case 'browse':
				$aResponse['result'] = array();
				$aList = $this->scanDir($sPath, 'json');
				asort($aList);
				foreach ($aList as $sFile) {
					$sTitle = '';
					$oFile = @fopen($sFile, 'rb');
					if ($oFile) {
						$sTitle = fread($oFile, 512);
						fclose($oFile);
						$iStart = strpos($sTitle, 'title":"') + 8;
						$iEnd = strpos($sTitle, '",', $iStart);
						$sTitle = stripslashes(substr($sTitle,$iStart, $iEnd - $iStart));
					}
					$aResponse['result'][] = array(
						pathinfo(str_replace(DIRECTORY_SEPARATOR, '.', substr($sFile, strlen($sPath) + 1)), PATHINFO_FILENAME),
						$sTitle
				);
				}
			break;
			case 'open':
				$sPath = $sPath.DIRECTORY_SEPARATOR.str_replace('.', DIRECTORY_SEPARATOR, $this->request->query('ns'));
				if (file_exists($sPath.'.json')) {
					$this->response->body('{"result":'.@file_get_contents($sPath.'.json').'}');
					return;
				}
				else {
					$aResponse['error'] = ucwords($sType).' not found';
				}
			break;
			case 'download':
				$sPath = $sPath.DIRECTORY_SEPARATOR.str_replace('.', DIRECTORY_SEPARATOR, $this->request->query('ns'));
				$this->response->body(@file_get_contents($sPath.'.zip'));
				$this->response->headers('content-length', strlen($this->response->body()));
				$this->response->headers('content-type', 'application/octet-stream');
				$sName = strtolower(str_replace('.', '-', $this->request->query('ns')));
				$this->response->headers('content-disposition', 'attachment; filename="'.$sName.'.zip"');
					$this->response->headers('cache-control', 'max-age=28800, must-revalidate');
			return;
			default:
				$aResponse['error'] = 'Invalid operation.';
			}
		}
		$this->response->body(json_encode($aResponse));
	}
	
	/**
	 * Retrieves a list of files starting from a folder and matching a search file extension
	 * @protected
	 * @param	{String}	sPath	Start folder
	 * @param	{String}	[sExt]	Fie extension glob
	 * @returns	{Array}	The list of matching file paths
	 */
	protected function scanDir($sPath, $sExt = '*')
	{
		$aScan = array();
		$aList = @scandir($sPath);
		if (empty($aList)) {
			return $aScan;
		}
		foreach($aList as $sItem) { 
			if($sItem !== '.' && $sItem !== '..') {
				$sFile = $sPath.DIRECTORY_SEPARATOR.$sItem;
				if (is_dir($sFile)) {
					$aScan = array_merge($aScan, $this->scanDir($sFile, $sExt));
				}
				elseif ($sExt === '*' || substr($sItem, strpos($sItem.'.', '.') + 1) === $sExt) {
					$aScan[] = $sFile;
				}
			}
		}
		return $aScan;
	}

	
	/**
	 * Unpacks a ZIP file
	 * @protected
	 * @param	{String}	File path
	 * @param	{String}	sWhere	Destination folder
	 * @param	{Boolean}	[bOverwrite]	True to overwrite files
	 * @returns	{Boolean}	True on success, false on failure
	 */
	protected function unzip($sZip, $sWhere, $bOverwrite = false)
	{
		$oZip = @zip_open($sZip);
		if (!is_resource($oZip)) { return false; }
		while (($oZipEntry = zip_read($oZip)) !== false) {
			$sFile = DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, zip_entry_name($oZipEntry));
			if (substr($sFile, -1) === DIRECTORY_SEPARATOR) { $sDir = substr($sFile, 0, -1); }
			else { $sDir = dirname($sFile); }
			if (strlen($sDir) && $sDir !== '.' && !is_dir($sWhere.$sDir)) {
				@mkdir($sWhere.$sDir, 0755, true);
			}
			if (substr($sFile, -1) !== DIRECTORY_SEPARATOR && ($bOverwrite || !is_file($sWhere.$sFile))) {
				@file_put_contents($sWhere.$sFile, zip_entry_read($oZipEntry, zip_entry_filesize($oZipEntry)));
			}
		}
		zip_close($oZip);
		return true;
	}

	/**
	 * Creates a ZIP file from a list of paths
	 *p@protected
	 * @param	{String}	sName	File path without extension
	 * @param	{Array}	aEntries	List of file paths
	 * @returns	True on success, false on failure
	 */
	protected function zip($sName, $aEntries)
	{
		if (!is_array($aEntries)) { return false; }
		$oZip = new ZipArchive();
		if ($oZip->open($sName.'.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) { return false; }
		@set_time_limit(0);
		foreach ($aEntries as $sPath => &$sContent) {
			$oZip->addFromString($sPath.'.js', $sContent);
		}
		$oZip->close();
		return true;
	}
	
	/**
	 * Checks if a NS is valid
	 */
	protected function validNS($sNS)
	{
		return preg_match('/[$\w\.]+/', $sNS);
	}

} // End Main
