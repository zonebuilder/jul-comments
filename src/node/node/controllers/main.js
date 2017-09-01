/*
	JUL Comment System (JCS) version 1.3.6
	Copyright (c) 2015 - 2017 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-comments/
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-comments/wiki/License/)
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, loopfunc: true,  
	onevar: true, newcap: true, noarg: true, node: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL, DIRECTORY_SEPARATOR, DOCROOT */
'use strict';
require('jul');
var oApp = JUL.ns('JUL.Comments');
var oFS = require('fs-extra');
var oPath = require('path');
var oGulp = require('gulp');
var oPlugins = require('gulp-load-plugins')();
require('zip-stream');
require('pump');

/**
 * A REST server for JUL.Comments
 */
JUL.apply(exports, {
	/**
	 * Delivers Designer's main page
	 */
	index: function(oRequest, oResponse) {
		var oReady = {set: function(sKey, oValue) {
			this[sKey] = oValue || true;
			if (this.updated && this.body) { oResponse.send(this.body); }
		}};
		var oConfig = oApp.Config('main');
		oResponse.render('main', JUL.apply({
			assets: oApp.Helper('assets'),
			app: {
				version: oConfig.version,
				title: oConfig.title,
				config: {
					zb_link: oConfig.zb_link
				}
			},
			updated: function() { oReady.set('updated'); }
		}, oConfig), function(oError, sRendered) { oReady.set('body', sRendered); });
		if (oRequest.url.indexOf('?') > -1) { return; }
		var aZip = ['_projects', '_examples'];
		for (var i = 0; i < aZip.length; i++) {
			var sFrom = DOCROOT + 'application' + DIRECTORY_SEPARATOR + aZip[i] + '.zip';
			if (oFS.existsSync(sFrom)) {
				this._unzip(sFrom, oConfig.work_dir, false, (function(sItem) {
					return function() { try { oFS.unlinkSync(sItem); } catch (e) {} };
				})(sFrom));
			}
		}
	},
	/**
	 * Manages the HTTP REST requests. PUT and DELETE are implemented via POST.
	 */
	manage: function(oRequest, oResponse) {
		var oResult = {};
		var sRequestType, sConfigFolder, sPath, sDir, sType;
		sRequestType = oRequest.method.toUpperCase();
		if (sRequestType === 'POST') {
			if (!this._validNS(oRequest.body.ns) || oRequest.body.type !== 'project') {
				oResponse.send('{"error":"Invalid operation"}');
				return;
			}
			sConfigFolder = oRequest.body.type + 's';
			sPath = oApp.Config('main').work_dir + DIRECTORY_SEPARATOR + sConfigFolder + DIRECTORY_SEPARATOR +
				oRequest.body.ns.replace(/\./g, DIRECTORY_SEPARATOR);
			sDir = oPath.dirname(sPath);
			sType = oRequest.body.type;
			var bReturn = false;
			switch (oRequest.body.operation) {
			case 'delete':
			if (oFS.existsSync(sPath + '.json') && oFS.statSync(sPath + '.json').isFile()) {
				try {
					oFS.unlinkSync(sPath + '.json');
					bReturn = true;
				}
				catch (e11) {}
				if (!bReturn) {
					oResult.error = 'Access denied';
					break;
				}
				if (sType === 'project') {
					try { oFS.unlinkSync(sPath + '.zip'); } catch (e12) {}
				}
				try { oFS.rmdirSync(sDir); } catch (e15) {}
				oResult.result = this._ucwords(sType) + ' deleted';
			}
			else {
				oResult.error = 'File not found';
			}
			break;
			case 'new':
			case 'edit':
			case 'saveCode':
			if (oFS.existsSync(sPath + '.json') && oFS.statSync(sPath + '.json').isFile() &&
				(oRequest.body.operation === 'new' || oRequest.body.old_ns !== oRequest.body.ns)) {
				oResult.error = ('A ' + sType + ' with the same namespace already exists');
				break;
			}
			/* falls through */
			case 'save':
				if (!oFS.existsSync(sDir) || !oFS.statSync(sDir).isDirectory()) {
					try { oFS.ensureDirSync(sDir); } catch (e17) {}
				}
				if (oRequest.body.json) {
					try {
						oFS.writeFileSync(sPath + '.json', oRequest.body.json);
						bReturn = true;
					}
					catch (e18) {}
					if (!bReturn) {
						oResult.error = 'Access denied';
						break;
					}
				}
				if (oRequest.body.code) {
					this._zip(sPath, oRequest.body.code, function() {
						oResponse.send('{"result":"New file saved"}');
					});
					return;
				}
				oResult.result = 'New file saved';
			break;
			default:
				oResult.error = 'Invalid operation.';
			}
		}
		if (sRequestType === 'GET') {
			if ((oRequest.query.operation !== 'browse' && !this._validNS(oRequest.query.ns)) ||
				oRequest.query.type !== 'project') {
				oResponse.send('{"error":"Invalid operation"}');
				return;
			}
			sConfigFolder = oRequest.query.type + 's';
			sPath = oApp.Config('main').work_dir + DIRECTORY_SEPARATOR + sConfigFolder;
			sType = oRequest.query.type;
			switch (oRequest.query.operation) {
			case 'browse':
				oResult.result = [];
				var aList = this._scanDir(sPath, 'json');
				aList.sort(function(a, b) { return a.toLowerCase() > b.toLowerCase() ? 1 : -1; });
				var oReady = {count: 0, items: {}, set: function(sFile, sData) {
					if (sFile) { this.items[sFile] = (this.items[sFile] || '') + sData; }
					if (!sFile || typeof sData === 'undefined') { this.count++; }
					if (this.count < aList.length) { return; }
					for (var i = 0; i < aList.length; i++) {
						if (typeof this.items[aList[i]] !== 'undefined') {
							var sTitle = this.items[aList[i]].split('title":"')[1].split('"')[0];
							var sFileName = aList[i].substr(sPath.length + 1).replace(/(\/|\\)/g, '.');
							oResult.result.push([
								sFileName.substr(0, sFileName.lastIndexOf('.')),
								JSON.parse('"' + sTitle + '"')
							]);
						}
					}
					oResponse.send(JSON.stringify(oResult));
				}};
				for (var i = 0; i < aList.length; i++) {
					var sFile = aList[i];
					try {
						oFS.createReadStream(sFile, {encoding: 'utf8', start: 0, end: 511}).on('data', (function(sItem) {
							return function(sData) { oReady.set(sItem, sData); };
						})(sFile)).on('end', (function(sItem) {
							return function() { oReady.set(sItem); };
						})(sFile));
					}
					catch (e21) {
						oReady.set();
					}
				}
			return;
			case 'open':
				sPath = sPath + DIRECTORY_SEPARATOR + oRequest.query.ns.replace(/\./g, DIRECTORY_SEPARATOR);
				if (oFS.existsSync(sPath + '.json')) {
					try {
						oResponse.send('{"result":' + oFS.readFileSync(sPath + '.json', 'utf8') + '}');
					}
					catch (e22) {
						oResponse.send('{"error":"Access denied"}');
					}
					return;
				}
				else {
					oResult.error = this._ucwords(sType) + ' not found';
				}
			break;
			case 'download':
				sPath = sPath + DIRECTORY_SEPARATOR + oRequest.query.ns.replace(/\./g, DIRECTORY_SEPARATOR);
				var sName = oRequest.query.ns.toLowerCase().replace(/\./g, '-');
				try {
					oResponse.header('Content-Length', oFS.statSync(sPath + '.zip').size)
					.header('Content-Type', 'application/octet-stream')
					.header('Content-Disposition', 'attachment; filename="' + sName + '.zip"')
					.header('Cache-Control', 'max-age=28800, must-revalidate')
					.send(oFS.readFileSync(sPath + '.zip'));
				}
				catch (e31) {
					oResponse.status(404).send('Not found');
				}
			return;
			default:
				oResult.error = 'Invalid operation.';
			}
		}
		oResponse.send(JSON.stringify(oResult));
	},
	/**
	 * Retrieves a list of files starting from a folder and matching a search file extension
	 * @private
	 * @param	{String}	sPath	Start folder
	 * @param	{String}	[sExt]	Fie extension glob
	 * @returns	{Array}	The list of matching file paths
	 */
	_scanDir: function (sPath, sExt) {
		sExt = sExt || '*';
		var aScan = [];
		var aList = [];
		try { aList = oFS.walkSync(sPath); } catch (e) {}
		if (!aList.length) { return aScan; }
		for (var i = 0; i < aList.length; i++) { 
			var sFile = aList[i];
			var sItem = oPath.basename(sFile);
			if (sItem !== '.' && sItem !== '..' && !oFS.statSync(sFile).isDirectory()) {
				sItem = sItem.split('.');
				sItem.shift();
				if (sExt === '*' || sItem.join('.') === sExt) { aScan.push(sFile); }
			}
		}
		return aScan;
	},
	/**
	 * Unpacks a ZIP file
	 * @private
	 * @param	{String}	File path
	 * @param	{String}	sWhere	Destination folder
	 * @param	{Boolean}	[bOverwrite]	True to overwrite files
	 */
	_unzip: function(sFrom, sTo, bOverwrite, fDone) {
		var fExclude = function(oFile) {
			var sItem = sTo + DIRECTORY_SEPARATOR + oFile.path.replace(/\//g, DIRECTORY_SEPARATOR);
			var bDir = oFile.path.substr(-1) === '/';
			if (bDir) { oFS.ensureDirSync(sItem.substr(0 , -1)); }
			return bDir || (!bOverwrite && oFS.existsSync(sItem));
		};
		oGulp.src(sFrom)
		.pipe(oPlugins.unzip())
		.pipe(oPlugins.ignore.exclude(fExclude))
		.pipe(oGulp.dest(sTo))
		.on('end', function() {
			if (fDone) { setTimeout(fDone, 0); }
		});
	},
	/** 
	 *	Creates a ZIP file from a list of paths
	 *p@private
	 * @param	{String}	sName	File path without extension
	 * @param	{Array}	aEntries	List of file paths
	 */
	_zip: function(sName, aEntries, fDone) {
		if (typeof aEntries !== 'object') { return false; }
		var aKeys = Object.keys(aEntries);
		var oZip = new (require('zip-stream'))();
		var oReady = {count: 0, set: function() {
			if (this.count >= aKeys.length) {
				oZip.finish();
				return;
			}
			var sPath = aKeys[this.count];
			var sContent = aEntries[sPath];
			this.count++;
			oZip.entry(sContent, {name: sPath + '.js'}, function() { oReady.set(); });
		}};
		var oDest = oZip.pipe(typeof sName === 'object' ? sName : oFS.createWriteStream(sName + '.zip'))
		.on('close', function() {
			if (fDone) { setTimeout(fDone, 0); }
		 });
		oReady.set();
		return oDest;
	},
	/**
	 * Checks if a NS is valid
	 * @private
	 */
	_validNS: function(sNS) {
		return (/^[$\w\.]+$/).test(sNS);
	},
	/**
	 * Converts a string to upper case words
	 */	 	
	_ucwords: function(sText) {
		return sText.replace(/\w+/g, function(sItem) {
			return sItem[0].toUpperCase() + sItem.substr(1);
		});
	}
});
