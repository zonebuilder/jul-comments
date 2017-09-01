/*
	JUL Comment System (JCS) version 1.3.6
	Copyright (c) 2015 - 2017 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-comments/
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-comments/wiki/License/)
*/
/**
	@fileOverview	
	JCS - JUL Comment System is a way of documenting your JavaScript source code 
	while keeping the comments in a separate file. It allows you to associate 
	the comments to any version of the source code and to get the updated commented code.
	Also, JCS is able to generate and to document the code for an entire JavaScript namespace 
	or DOM tree loaded by a web page. 
	
	Features
	 * generates documented code from JavaScript source code or from runtime code
	 * saves the comments as a separate project for reuse and management of documenting different versions of the code
	 * recognizes types of data and generates comments blocks accordingly
	 * splits a JavaScript namespace into a custom number of child namespaces as documented source files with their corresponding code
	 * downloading the collection of generated source files as a zip package
	
	System requirements
	 * A CSS2 compliant web browser with JavaScript 1.5 or later engine
	 * A web server with PHP 5.2.0 or later extension
	 * 1024x768 minimum resolution
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, loopfunc: true,  
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals ample, JUL */

(function() {
'use strict';
var jul = JUL;

/* generated by JCS version 1.3.6 */

/**
	It holds the configuration for the JUL.Comments application
	@namespace
	@name	JUL.Comments
*/
jul.ns('JUL.Comments');

jul.apply(jul.get('JUL.Comments'), /** @lends JUL.Comments */ {
	/**
		Application's default parser config
		@type	Object
	*/
	parserConfig: {
		customFactory: 'JUL.UI.createDom', defaultClass: 'xul', topDown: true, useTags: true
	},
	/**
		It holds the runtime state of this module
		@type	Object
	*/
	state: {
		/**
			A list of mappings between field configs and component IDs
			@type	Array
		*/
		map: [], /**
			The field/component hashes for the 'Project' and 'File properties' dialogs
			@type	Object
		*/
		controls: {
			projectFields: {}, fileFields: {}
		}
	},
	/**
		Builds a comment field UI
		@param	{String}	sType	Field type
		@param	{Object}	oRef	JUL.Ref of the field value
		@returns	{Object}	UI config tree
	*/
	buildField: function(sType, oRef) {
		var oConfig = {tag: 'hbox', width: '100%', flex: 1, pack: 'start'};
		var aChildren = [];
		var i = 0;
		var oField = this.config.fieldTypes.hasOwnProperty(sType) ? this.config.fieldTypes[sType] : this.config.otherField;
		var fChange = function() {
			if (this.getAttribute('readonly') === 'true') { return; }
			var oWhere = JUL.Comments.getWhere(this);
			var bCheckbox = this.nodeName === 'xul:checkbox';
			var sVal = bCheckbox ? this.getAttribute('checked') === 'true' : this.getAttribute('value');
			if (!sVal && typeof oWhere.val() === 'undefined') { return; }
			if (sVal === oWhere.val()) { return; }
			if (sVal) { oWhere.val(sVal); }
			else { oWhere.del(); }
			JUL.Comments.project.onFieldChange(oWhere, this);
	};
	var nEdit = -1;
	for (var sItem in oField.fields) {
		if (oField.fields.hasOwnProperty(sItem)) {
				var sKind = oField.fields[sItem];
				switch (sKind) {
				case 'text':
				case 'edit':
					nEdit = i;
					aChildren[i] = {tag: 'textbox', id: this.newId(), style: 'width:130px', value: oRef[sItem] || ''};
					this.state.map[this.lastId()] = new JUL.Ref({ref: oRef, key: sItem});
					aChildren[i].listeners = {
						change: fChange,
						keypress: function(oEvent) { if (oEvent.keyIdentifier === 'Enter') { fChange.call(this); }}
					};
					if (oRef.value && oRef.value.indexOf('\n') > -1) {
						JUL.apply(aChildren[i], {
							value: oRef.value.substr(0, 150).replace(/\t/g, ' ').replace(/\n\r?/g, ' ') + ' ...',
							readonly: true,
							tooltiptext: 'Text is multiline. Use \'Edit\' to change.'}
						);
					}
					if (sKind === 'edit') { i++; }
					else { break; }
					aChildren[i] = {tag: 'button', id: this.newId(), width: 30, label: 'Edit', tooltiptext: sType};
					aChildren[i].listeners = {
						command: function() {
							var oWhere = JUL.Comments.getWhere(this.previousSibling);
							ample.getElementById('textbox-edit').setAttribute('value', oWhere.val() || '');
							JUL.Comments.state._control = this.previousSibling;
							var oEdit = ample.getElementById('dialog-edit');
							oEdit.setAttribute('title', this.getAttribute('tooltiptext'));
							oEdit.showModal();
							setTimeout(function() {
								ample.getElementById('textbox-edit').focus();
							}, 500);
						}
					};
				break;
				case 'bool':
					aChildren[i] = {tag: 'checkbox', id: this.newId(), style: 'width:70px', label: sItem.substr(0, 1).toUpperCase() + sItem.substr(1), checked: oRef[sItem] || false};
					this.state.map[this.lastId()] = new JUL.Ref({ref: oRef, key: sItem});
					aChildren[i].listeners = {change: fChange};
				break;
				case 'type':
					aChildren[i] = {tag: 'menulist', id: this.newId(), editable: true, value: oRef[sItem] || '', children: [
						{tag: 'menupopup', listeners: {
							popuphidden: function() {
								var oThis = this;
								setTimeout(function() { fChange.call(oThis.parentNode); }, 50);
							}
						}}
					]};
					this.state.map[this.lastId()] = new JUL.Ref({ref: oRef, key: sItem});
					aChildren[i].listeners = {blur: function() {
						this.setAttribute('value', this.$getContainer('input').value);
						fChange.call(this);
					}};
					var aMenu = [];
					for (var l = 0; l < this.config.typeSelect.length; l++) {
						aMenu[l] = {tag: 'menuitem', label: this.config.typeSelect[l], value: this.config.typeSelect[l]};
					}
					aChildren[i].children[0].children = aMenu;
					aChildren[i] = {tag: 'vbox', width: 90, children: [aChildren[i]]};
				break;
				default:
					i--;
				}
				i++;
			}
		}
		if (nEdit > -1) {
			JUL.apply(aChildren[nEdit], {flex: 3, style: 'width:100%'});
		}
		if (aChildren.length) { oConfig.children = aChildren; }
		return oConfig;
	},
	/**
		Creates list box rows for several interface parts
		@param	{String}	sType	The type of interface part
		@param	{Object}	[oInit]	Optional initializing hash
	*/
	createRows: function(sType, oInit) {
		var oRows = ample.getElementById('grid-settings').querySelector('xul|rows');
		this.empty(oRows);
		sType = sType || 'project';
		var oControls = this.state.controls[sType + 'Fields'];
		var oFields = this.config[sType + 'Fields'];
		for (var sItem in oFields) {
			if (oFields.hasOwnProperty(sItem)) {
				var oField = oFields[sItem];
				var sId = this.newId();
				var oConfig = {tag: 'row', children: [
					{tag: 'label', control: sId, html: oField.desc},
					{tag: 'textbox', id: sId, style: 'width:530px'}
				]};
				if (oField.type === 'bool') {
					oConfig.children[1].tag = 'checkbox';
					delete oConfig.children[1].style;
				}
				if (oField.type === 'number') {
					oConfig.children[1].type = 'number';
					oConfig.children[1].style = 'width:60px';
					oConfig.children[1].min = oField.min || 0;
				}
				if (oField.type === 'edit') {
					oConfig.height = oField.large ? 260 : 115;
					oConfig.children[1].multiline = true;
					oConfig.children[1].css = 'code';
					oConfig.children[1].style = 'width:530px;height:' + (oField.large ? 260 : 115) + 'px';
				}
				if (sType === 'file' && sItem === 'useJul') {
					oConfig.children[1].listeners = oConfig.children[1].listeners || {};
					oConfig.children[1].listeners.change = function() {
						var oApp = JUL.Comments;
						var sTemplate = oApp.config.fileFields.template.init;
						ample.getElementById(oApp.state.controls.fileFields.template).setAttribute('value',
							sTemplate.replace('{code}', this.getAttribute('checked') === 'true' ? oApp.wrapExport('{code}', true) : '{code}'));
					};
				}
				this.project.parser.create(oConfig, null, oRows);
				oControls[sItem] = sId;
				if (oField.type === 'edit') {
					ample.getElementById(sId).addEventListener('keydown', this.filterTab);
					ample.getElementById(sId).$getContainer('input').wrap = 'off';
				}
			}
		}
		oInit = oInit || {};
		for (sItem in oControls) {
			if (oControls.hasOwnProperty(sItem)) {
				oField = oFields[sItem];
				ample.getElementById(oControls[sItem]).setAttribute(oField.type === 'bool' ? 'checked' : 'value', typeof oInit[sItem] !== 'undefined' ?
					(JUL.typeOf(oInit[sItem]) === 'Array' ? oInit[sItem].join(', ') : oInit[sItem]) :
						(typeof oField.init === 'undefined' ?  (oField.type === 'bool' ? false : '') : oField.init));
			}
		}
	},
	empty: function(oEl, bRemove) {
		if (!oEl) { return; }
		if (!oEl.nodeName && !isNaN(oEl.length)) {
			ample.query(oEl).each(function() { JUL.Comments.empty(this, bRemove); });
			return;
		}
		while (oEl.lastChild) {
			this.empty(oEl.lastChild);
			oEl.removeChild(oEl.lastChild);
		}
		if (bRemove) { oEl.parentNode.removeChild(oEl); }
	},
	filterTab: function(oEvent) {
		if (oEvent.keyIdentifier === 'U+0009') {
			oEvent.preventDefault();
			var oEl = this.$getContainer('input');
			if (!oEl) { return false; }
			try {
				var nStart = oEl.selectionStart || 0;
				var nEnd = oEl.selectionEnd || 0;
				var sValue = this.getAttribute('value');
				this.setAttribute('value', sValue.slice(0, nStart) + '\t' + sValue.substr(nEnd));
				oEl.selectionEnd = nStart + 1;
				oEl.selectionStart = nStart + 1;
			}
			catch(e) {}
		 return false;
		}
	},
	/**
		Finds an item in an array of items by a certain property
		@param	{Mixed}	oVal	Value to search for
		@param	{Array}	aItems	Array of items
		@param	{String}	sProperty	The name of the property to look for
		@param	{Number}	[nStart]	Optional start index, defaults to 0
		@returns	{Number}	The index of found item or -1 if not found
	*/
	findBy: function(oVal, aItems, sProperty, nStart) {
		for (var i = nStart || 0; i < aItems.length; i++) {
			if (aItems[i][sProperty] === oVal) { return i; }
		}
		return -1;
	},
	/**
		Generates a block comment of a given type
		@param	{String}	sWhat	The type of block comment
		@param	{Mixed}	oVal	The value to generate the block comment for
		@param	{Array}	[aOld]	Array of comment fields to carry over
		@returns	{Array}	Array of comment fields describing the block comment
	*/
	generateComment: function(sWhat, oVal, aOld) {
		aOld = aOld || [];
		var aFields = this.config.commentTemplates[sWhat] || [];
		var oIndexes = {};
		var aComment = [];
		var k = 0;
		var u = 0;
		for (var i = 0; i < aFields.length; i++) {
			if (aFields[i] === 'params' || aFields[i] === 'returns') {
				var sBody = typeof oVal === 'function' ? JUL.UI.obj2str(oVal) : '';
				var aMatch = null;
				if (aFields[i] === 'params') {
					aMatch = sBody.match(/^function\s*\(([\s\S]*?)\)/);
					if (!aMatch || !JUL.trim(aMatch[1])) { continue; }
					var aParams = aMatch[1].split(',').map(JUL.trim);
					for (var j = 0; j < aParams.length; j++) {
						aComment[k] = {field: 'param'};
						aComment[k].name = aParams[j];
						aComment[k].type = this.getByPrefix(aParams[j]);
						if (aParams[j].substr(0, 1) === '_') { aComment[k].optional = true; } 
						oIndexes.param = oIndexes.param || 0;
						u = this.findBy('param', aOld, 'field', oIndexes.param);
						if (u > -1) {
							aComment[k].description = aOld[u].description;
							oIndexes.param = u + 1;
						}
						else {
							aComment[k].description = 'Parameter description';
						}
						k++;
					}
				}
				else {
					aMatch = sBody.match(/return\W+\S+/g);
					if (!aMatch) { continue; }
					var sReturn = JUL.trim(aMatch.pop().substr(6));
					if (sReturn.substr(0, 1) === ';' || sReturn.substr(0, 1) === '}') { continue; }
					aComment[k] = {field: 'returns'};
					if (sReturn.substr(0, 1) === '{') { aComment[k].type = 'Object'; }
					else if (sReturn.substr(0, 1) === '[') { aComment[k].type = 'Array'; }
					else if (/^null/.test(sReturn)) { aComment[k].type = 'Object'; }
					else if (/^(false|true)/.test(sReturn)) { aComment[k].type = 'Boolean'; }
					 else if (/^[a-z]{2}/.test(sReturn)) { aComment[k].type = 'Mixed'; }
					 else { aComment[k].type = this.getByPrefix(sReturn); }
					oIndexes.returns = oIndexes.returns || 0;
					u = this.findBy('returns', aOld, 'field', oIndexes.returns);
					if (u > -1) {
						aComment[k].description = aOld[u].description;
						oIndexes.returns = u + 1;
					}
					else {
						aComment[k].description = 'Return description';
					}
					k++;
				}
			}
			else {
				var sKey = aFields[i];
				aComment[k] = {field: sKey};
				if (sKey === 'description' || sKey === 'fileOverview') {
					aComment[k].value = sWhat.substr(0, 1).toUpperCase() + sWhat.substr(1) + ' description';
				}
				oIndexes[sKey] = oIndexes[sKey] || 0;
				u = this.findBy(sKey, aOld, 'field', oIndexes[sKey]);
				if (u > -1) {
					JUL.apply(aComment[k], aOld[u]);
					oIndexes[sKey] = u + 1;
				}
				if (sKey === 'type') {
					aComment[k].value = JUL.typeOf(oVal).replace('Null', 'Object');
				}
				k++;
			}
		}
		return aComment;
	},
	/**
		Gets a JavaScript type from the prefix of a variable
		@param	{String}	sName	Variable name
		@returns	{String}	JavaScript class name
	*/
	getByPrefix: function(sName) {
		sName = JUL.trim(sName, '_');
		if (!sName) {  return 'Mixed'; }
		switch (sName.substr(0, 1)) {
			case '[':
			case 'a': return 'Array';
			case '!':
			case 'b': return 'Boolean';
			case 'd': return 'Date';
			case 'f': return 'Function';
			case '-': case '0': case '1': case '2': case '3': case '4':
			case '5': case '6': case '7': case '8': case '9':
			case 'n': return 'Number';
			case '{':
			case 'o': return 'Object';
			case '/':
			case 'r': return 'RegExp';
			case '"':
			case "'":
			case 's': return 'String';
			default: return 'Mixed';
		}
	},
	/**
		Renders the block comment given its fields
		@param	{Array}	aFields	Array of comment fields
		@returns	{String}	The block comment
	*/
	getComment: function(aFields) {
		if (!aFields.length) { return ''; }
		var aComments = [];
		for (var i = 0; i < aFields.length; i++) {
			var oField = JUL.apply(this.getEmptyField(aFields[i].field), aFields[i]);
			var oConfig = this.config.fieldTypes.hasOwnProperty(oField.field) ? this.config.fieldTypes[oField.field] : this.config.otherField;
			if (oConfig.hidden) { continue; }
			if (typeof oField.optional !== 'undefined') {
				oField.lsb = oField.optional ? '[' : '';
				oField.rsb = oField.optional ? ']' : '';
			}
			aComments.push(this.config.linePrefix + this.template(oConfig.template, oField).replace(/\s+$/, '')
				.replace(/\n\r?/g, this.project.coder._newlineString + this.config.linePrefix).replace(/\t/g, this.project.coder._tabString) + this.project.coder._newlineString);
		}
		if (!aComments.length) { return ''; }
		return this.config.blockStart + aComments.join('') + this.config.blockEnd;
	},
	/**
		Hints a block comment type for a given value
		@param	{Mixed}	oVal	value to hint
		@param	{String}	sName	Variable name
		@returns	{String}	Block comment type
	*/
	getCommentType: function(oVal, sName) {
		if (sName === '@fileOverview' ) { return 'fileOverview'; }
		var bClass = /^[A-Z]/.test(sName || '');
		switch (JUL.typeOf(oVal)) {
		case 'Object':
			if (bClass) { return 'namespace'; }
			else { return 'property'; }
		break; // required by jshint
		case 'Array':
		case 'Boolean':
		case 'Date':
		case 'Null':
		case 'Number':
		case 'RegExp':
		case 'Undefined':
		case 'String':
			return 'property';
		case 'Function':
			if (bClass) { return 'class'; }
			else { return 'method'; }
		break; // required by jshint
		default:
			return 'none';
		}
	},
	/**
		Gets an empty comment field of a given type
		@param	{String}	sType	Field type
		@returns	{Object}	Field object
	*/
	getEmptyField: function(sType) {
		var oField = {field: sType};
		var oItems = this.config.fieldTypes.hasOwnProperty(sType) ? this.config.fieldTypes[sType].fields : this.config.otherField.fields;
		for (var sItem in oItems) {
			if (oItems.hasOwnProperty(sItem)) { oField[sItem] = oItems[sItem] === 'bool' ? false : ''; }
		}
		return oField;
	},
	/**
		Gets the current two-segments domain
		@returns	{String}	Domain address
	*/
	getSecondDomain: function() {
		var sDomain = window.document.domain;
		if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?$/.test(sDomain)) { return sDomain; }
		var aParts = sDomain.split('.');
		var sEnd = aParts.pop();
		return aParts.length ? aParts.pop() + '.' + sEnd : sEnd; 
	},
	/**
		Returns the reference mapped to a given element
		@param	{Object}	oElement	Element or element ID
		@returns	{Mixed}	Mapped reference or value
	*/
	getWhere: function(oElement) {
		if (typeof oElement === 'string') { return this.state.map[oElement]; }
		else { return this.state.map[oElement.getAttribute('id')]; }
	},
	/**
		Application's entry point
	*/
	init: function () {
		var aModules = ['project', 'edit', 'browse', 'open', 'help', 'about'];
		for (var i = 0; i < aModules.length; i++) {
			var oModule = this[aModules[i]];
			if (!oModule) { continue; }
			oModule.app = this;
			oModule.parser = new JUL.UI.Parser(oModule.parserConfig || this.parserConfig);
			var oPanel = oModule.parser.create(oModule.ui, oModule.logic);
			if (oPanel) { ample.documentElement.appendChild(oPanel); }
		}
		this.onInit();
	},
	/**
		Gets the last generated ID
		@returns	{String}	ID string
	*/
	lastId: function() {
		return this.state.lastId || 'field-0';
	},
	/**
		Generates a new unique ID
		@param	{String}	[sPrefix]	ID prefix
		@returns	{String}	ID string
	*/
	newId: function(sPrefix) {
		this.state._lastId = this.state._lastId || 1;
		this.state.lastId = (sPrefix || 'field-') + this.state._lastId++;
		return this.state.lastId;
	},
	/**
		Fires after application's initialization
	*/
	onInit: function() {
		this.project.coder = new JUL.UI.Parser(this.project.coderConfig);
		for (var sItem in this.project.coder._jsonPrefixes) {
			if (this.project.coder._jsonPrefixes.hasOwnProperty(sItem)) {
				this.project.coder._jsonPrefixes[sItem] = '*' + this.project.coder._jsonPrefixes[sItem];
			}
		}
		this.restorePrefs();
		ample.getElementById('statuspanel-title').setAttribute('label', this.title + ' version ' + this.version);
		ample.getElementById('statuspanel-project').setAttribute('label', '');
		setTimeout(function() {
			ample.getElementById('window-about').showModal();
		}, 500);
		setTimeout(function() {
			ample.getElementById('window-about').hide();
		}, 5000);
		var oMenu = ample.getElementById('menulist-generate').querySelector('xul|menupopup');
		for (sItem in this.config.commentTemplates) {
			if (this.config.commentTemplates.hasOwnProperty(sItem)) {
				this.project.parser.createComponent({tag: 'menuitem', label: sItem, value: sItem, parent: oMenu});
			}
		}
		this.project.parser.createComponent({tag: 'menuitem', label: 'none', value: 'none', parent: oMenu});
		 oMenu = ample.getElementById('menulist-field').querySelector('xul|menupopup');
		var oKeys = {standard: [], meta: []};
		for (sItem in this.config.fieldTypes) {
			if (this.config.fieldTypes.hasOwnProperty(sItem)) {
				oKeys[sItem.substr(0, 1) === '<' ? 'meta' : 'standard'].push(sItem);
			}
		}
		var aKeys = [].concat(oKeys.standard.sort(), oKeys.meta.sort());
		for (var i = 0; i < aKeys.length; i++) {
			this.project.parser.createComponent({tag: 'menuitem', label: aKeys[i], value: aKeys[i], parent: oMenu});
		}
		ample.getElementById('textbox-edit').addEventListener('keydown', this.filterTab);
		ample.getElementById('textbox-preview').$getContainer('input').wrap = 'off';
		ample.getElementById('textbox-code').$getContainer('input').wrap = 'off';
		ample.getElementById('textbox-edit').$getContainer('input').wrap = 'off';
		ample.getElementById('iframe-site').addEventListener('load', function() {
			try {
				var sGet = JUL.trim(ample.getElementById('textbox-object').getAttribute('value'));
				var oProject = JUL.Comments.project;
				if (sGet && oProject.current.ns) { oProject.findObject(sGet); }
			}
			catch (e) {}
		});
		ample.getElementById('iframe-help').addEventListener( 'load', this.help.onLoad);
	},
	/**
		Applies the <replace> meta fields over the given string
		@param	{String}	sText	Text to transform
		@param	{Array}	aFields	Array of comment fields
		@returns	{String}	Transformed text
	*/
	replace: function(sText, aFields) {
		var sPattern, sType;
		for (var i = 0; i < aFields.length; i++) {
			var oField = aFields[i];
			if (oField.field !== '<replace>' || !oField.regex) { continue; }
			if (JUL.UI._regExps.regexp.test(oField.regex)) {
				var nEnd = oField.regex.lastIndexOf('/');
				sPattern = oField.regex.slice(1, nEnd);
				sType = oField.regex.substr(nEnd + 1);
			}
			else {
				sPattern = oField.regex;
				sType = '';
			}
			try {
			var oRe = new RegExp(sPattern, sType);
			sText = sText.replace(oRe, oField.value || '');
			}
			catch (e) {}
		}
		return sText;
	},
	/**
		Restores the interface preferences
	*/
	restorePrefs: function() {
		try {
			var oRestore = JSON.parse(ample.cookie('jcs-prefs'));
		}
		catch (e) { return; }
		if (!oRestore || typeof oRestore !== 'object') { return; }
		for (var sItem in this._prefs) {
			if (this._prefs.hasOwnProperty(sItem) && oRestore[sItem]) {
				var aEl = ample.query(sItem);
				var aItems = oRestore[sItem];
				for (var k = 0; k < aEl.length && k < aItems.length; k++) {
					var oEl = aEl.get(k);
					var aPrefs = [].concat(this._prefs[sItem]);
					for (var i = 0; i < aPrefs.length; i++) {
						var sPref = aPrefs[i];
						if (typeof aItems[k][sPref] !== 'undefined') { oEl.setAttribute(sPref, aItems[k][sPref]); }
					}
				}
			}
		}
	},
	/**
		Saves the text from the comment edit dialog
	*/
	saveCode: function() {
		var oWhere = JUL.Comments.getWhere(JUL.Comments.state._control);
		var sVal = ample.getElementById('textbox-edit').getAttribute('value').replace(/\s+$/, '');
		if (sVal === oWhere.val()) { return; }
		if (sVal.indexOf('\n') > -1) {
			JUL.Comments.state._control.setAttribute('value', sVal.substr(0, 150).replace(/\t/g, ' ').replace(/\n\r?/g, ' ') + ' ...');
			JUL.Comments.state._control.setAttribute('readonly', true);
			JUL.Comments.state._control.setAttribute('tooltiptext', 'Text is multiline. Use \'Edit\' to change.');
		}
		else {
			JUL.Comments.state._control.setAttribute('value', sVal);
			JUL.Comments.state._control.removeAttribute('readonly');
			JUL.Comments.state._control.removeAttribute('tooltiptext');
		}
		if (sVal) { oWhere.val(sVal); }
		else { oWhere.del(); }
		JUL.Comments.project.onFieldChange(oWhere, JUL.Comments.state._control);
	},
	/**
		Saves the interface preferences client-side
	*/
	savePrefs: function() {
		var oSave = {};
		for (var sItem in this._prefs) {
			if (this._prefs.hasOwnProperty(sItem)) {
				var aEl = ample.query(sItem);
				var aItems = [];
				if (aEl.length) { oSave[sItem] = aItems; }
				for (var k = 0; k < aEl.length; k++) {
					var oEl = aEl.get(k);
					oEl.getBoundingClientRect();
					var aPrefs = [].concat(this._prefs[sItem]);
					aItems[k] = {};
					for (var i = 0; i < aPrefs.length; i++) {
						var sPref = aPrefs[i];
						var sAttr = oEl.getAttribute(sPref);
						if (sAttr && sAttr !== '0') { aItems[k][sPref] = sAttr; } 
					}
				}
			}
		}
		ample.cookie('jcs-prefs', JSON.stringify(oSave), {
			expires: 7,
			path: '/'
		});
	},
	/**
		Simple templating routine for JavaScript
		@param	{String}	sTemplate	Template string
		@param	{Object}	oData	Hash between template keys and actual values
		@returns	{String}	Processed string
	*/
	template: function(sTemplate, oData) {
		return sTemplate.replace(/\{(\w+)\}/g, function(sMatch, sItem) {
			if (typeof oData[sItem] !== 'undefined') { return oData[sItem] || ''; }
			else { return sMatch; }
		});
	},
	/**
		Wraps generated JS in an exporting function
		@param	{String}	sCode	Code string to wrap
		@param	{Boolean}	[bComment]	True to generate comments
		@returns	{String}	Wrapped code
	*/
	wrapExport: function(sCode, bComment) {
		return "(function(global, module) {\n'use strict';\n" +
		"if (module && module.exports && typeof require === 'function') { require('jul'); }\n" +
			(bComment ? "\n/* if in Node, export the instance factory, else apply it to the global namespace  */" : "") +
			"\nvar fInstance = function(oNSRoot) {" +
			(bComment ? "\n/* create a JUL instance bound to oNSRoot and make it available to the inner code */" : "") +
			"\nvar jul = new JUL.Instance({nsRoot: oNSRoot || global});" +
			"\n\n" + sCode + "\n};" +
			"\n\nif (module && module.exports) {" +
			"\n\tmodule.exports = fInstance;\n}\nelse if (global) {\n\tfInstance(global);\n}\nreturn fInstance;" +
			"\n\n})(typeof global !== 'undefined' ? global : window, typeof module !== 'undefined' ? module : null);\n";
	},
	/**
		Hash between CSS selectors and lists of element properties
		@type	Object
		@private
	*/
	_prefs: {
		'#vbox-dom': 'width', '#iframe-site': 'height', '#vbox-preview': 'width', '#vbox-code': 'height',
		 '#tree-dom xul|treecol': 'width', '#listbox-comment xul|listheader': 'width', '#dialog-browse': ['width', 'height'],
		'#dialog-open': ['width', 'height'],
		'#dialog-edit': ['width', 'height']
	}
});

/* application additions */
window.document.domanin = JUL.Comments.getSecondDomain();
window.onbeforeunload = function(oEvent) {
	JUL.Comments.savePrefs();
	var oProject = JUL.Comments.project;
	try { oProject.checkSave(); } catch (e) {}
	if (oProject.state.jsonObject && oProject.state.notSaved) {
		return 'Unsaved project changes will be lost';
	}
};
JUL.apply(ample.classes[JUL.UI.xmlNS.xul + '#listcell'].prototype , {
	$getTagOpen: function() {
		var oHeader	= this.parentNode.parentNode.parentNode.firstChild.childNodes[this.parentNode.childNodes.$indexOf(this)];
		var sHtml	= '<td class="xul-listcell' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '"' + (oHeader && oHeader.getAttribute("hidden") === "true" ? ' style="display:none;"' : '') + '><div class="xul-listcell--box" style=""><div class="xul-listcell--label xul-listcell--gateway" style="">';
		if (this.hasAttribute("image")) {
			sHtml	+= '<img src="' + ample.$encodeXMLCharacters(this.getAttribute("image")) + '" align="absmiddle"/> ';
		}
		if (this.hasAttribute("label")) {
			sHtml	+= ample.$encodeXMLCharacters(this.getAttribute("label"));
		}
	
		return sHtml;
	},
	$getTagClose: function() {
		return '</div></div></td>';
	}
});
JUL.apply(ample.classes[JUL.UI.xmlNS.xul + '#iframe'].prototype, {
	$getTagOpen: function() {
	return '<iframe class="xul-iframe' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" onload="ample.$instance(this)._onLoad(event)" onunload="ample.$instance(this)._onUnLoad(event)"' +
				' height="' +(this.getAttribute("height") || '100%')+ '"' +
				' width="' +(this.getAttribute("width") || '100%')+ '"' +
				' src="' + (this.hasAttribute("src") ? ample.$encodeXMLCharacters(this.getAttribute("src")) : 'about:blank')+ '"' +
				' frameborder="0" border="0" scrolling="yes">';
	},
	$getTagClose: function() {
	return '</iframe>';
	}
});

})();

/* end JUL.Comments.js */
