/*
	JUL Comment System (JCS) version 1.3.8
	Copyright (c) 2015 - 2017 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-comments/
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-comments/wiki/License/)
*/
/**
	@fileOverview	This file configures the application and project operations
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, loopfunc: true,  
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals ample, JUL */

(function(global, module) {
'use strict';
if (module && module.exports && typeof require === 'function') { require('jul'); }

/* if in Node, export the instance factory, else apply it to the global namespace  */
var fInstance = function(oNSRoot) {
/* create a JUL instance bound to oNSRoot and make it available to the inner code */
var jul = new JUL.Instance({nsRoot: oNSRoot || global});

/* generated by JUL Designer version 2.1.1 */
/* 'JUL Comment System - Main page' namespace */
var oProject = jul.ns('JUL.Comments.project');

jul.apply(oProject,
/* begin 'JUL Comment System - Main page' */
{
	keepBindings: false,
	listenersProperty: 'listeners',
	noLogic: false,
	ns: 'JUL.Comments.project',
	suggestedFramework: 'xul',
	title: 'JUL Comment System - Main page',
	version: '1.1502961319399',
	init: function () {
		this.parser = new jul.ui.Parser(this.parserConfig);
		this.page = this.parser.create(this.ui, this.logic);
		if (this.page) { ample.documentElement.appendChild(this.page); }
	}
}
/* end 'JUL Comment System - Main page' */
);

oProject.parserConfig =
/* begin 'JUL Comment System - Main page' parser config */
{
	customFactory: 'JUL.UI.createDom',
	defaultClass: 'xul',
	topDown: true,
	useTags: true
}
/* end 'JUL Comment System - Main page' parser config */
;

oProject.ui =
/* begin 'JUL Comment System - Main page' UI */
{
	tag: 'page',
	children: [
		{tag: 'toolbar', children: [
			{tag: 'toolbargrippy'},
			{tag: 'toolbarbutton', id: 'tbutton-new-project', css: 'tbutton darkr', label: 'NP', tooltiptext: 'New project'},
			{tag: 'toolbarbutton', id: 'tbutton-open-project', css: 'tbutton darkr', label: 'OP', tooltiptext: 'Open project'},
			{tag: 'toolbarbutton', id: 'tbutton-edit-project', css: 'tbutton darkr', label: 'EP', tooltiptext: 'Edit project'},
			{tag: 'toolbarbutton', id: 'tbutton-close-project', css: 'tbutton darkr', label: 'CP', tooltiptext: 'Close project'},
			{tag: 'toolbarbutton', id: 'tbutton-delete-project', css: 'tbutton darkr', label: 'XP', tooltiptext: 'Delete project'},
			{tag: 'toolbarseparator'},
			{tag: 'toolbarbutton', id: 'tbutton-help-contents', css: 'tbutton darkb', label: 'HC', tooltiptext: 'Contents'},
			{tag: 'toolbarbutton', id: 'tbutton-help-about', css: 'tbutton darkb', label: 'HA', tooltiptext: 'About'},
			{tag: 'vbox', flex: 1, children: [
				{tag: 'description', id: 'description-title', pack: 'center', style: 'margin-top:6px', value: '{ JUL Comment System }'}
			]},
			{tag: 'toolbarbutton', id: 'tbutton-save-project', css: 'darky', label: 'Save project',
			 tooltiptext: 'Save project to enable downloading the code'},
			{tag: 'toolbarbutton', id: 'tbutton-download-code', css: 'darkg', label: 'Download code',
			 tooltiptext: 'Download the last saved code'},
			{tag: 'toolbarseparator'}
		]},
		{tag: 'hbox', flex: 1, children: [
			{tag: 'vbox', id: 'vbox-dom', width: 310, children: [
				{tag: 'description', css: 'caption', value: 'Site'},
				{tag: 'hbox', children: [
					{tag: 'description', style: 'padding:0 5px', tooltiptext: 'Enter an address in the same domain', value: 'Address'},
					{tag: 'textbox', id: 'textbox-address', flex: 1},
					{tag: 'button', id: 'button-go', label: 'Go'}
				]},
				{tag: 'iframe', id: 'iframe-site', height: 150},
				{tag: 'splitter'},
				{tag: 'description', css: 'caption', value: 'DOM'},
				{tag: 'hbox', children: [
					{tag: 'description', style: 'padding:0 5px', tooltiptext: 'Enter a dotted path', value: 'Object'},
					{tag: 'textbox', id: 'textbox-object', flex: 1},
					{tag: 'button', id: 'button-find', label: 'Find'}
				]},
				{tag: 'toolbar', children: [
					{tag: 'toolbargrippy'},
					{tag: 'toolbarbutton', id: 'tbutton-generate-comments', label: '+/**{ }*/',
					 tooltiptext: 'Auto-generate comments for selected items'},
					{tag: 'toolbarbutton', id: 'tbutton-remove-comments', label: '-/**{ }*/',
					 tooltiptext: 'Remove comments from selected items'},
					{tag: 'toolbarbutton', id: 'tbutton-undo-tree', label: 'Undo'}
				]},
				{tag: 'tree', id: 'tree-dom', flex: 1, children: [
					{tag: 'treecols', children: [
						{tag: 'treecol', label: 'Name', primary: true, width: 400}
					]},
					{tag: 'treebody'}
				]},
				{tag: 'hbox', children: [
					{tag: 'toolbargrippy'},
					{tag: 'checkbox', id: 'checkbox-separate-file', label: 'separate file, put outside',
					 tooltiptext: 'generate a distinct file for this object and its descendants'},
					{tag: 'textbox', id: 'textbox-put-outside', style: 'width:110px',
					 tooltiptext: 'comma delimited list of members to put separately in the file'}
				]},
				{tag: 'hbox', children: [
					{tag: 'toolbargrippy'},
					{tag: 'checkbox', id: 'checkbox-sort-keys', label: 'sort members',
					 tooltiptext: 'sort properties and methods alphabetically'},
					{tag: 'checkbox', id: 'checkbox-expand-proto', label: 'show prototype',
					 tooltiptext: 'expose object\'s prototype in the generated code'}
				]}
			]},
			{tag: 'splitter'},
			{tag: 'vbox', flex: 1, children: [
				{tag: 'hbox', flex: 1, children: [
					{tag: 'vbox', flex: 1, children: [
						{tag: 'description', css: 'caption', value: 'Comment'},
						{tag: 'hbox', children: [
							{tag: 'toolbargrippy'},
							{tag: 'button', id: 'button-add-field', label: 'Add'},
							{tag: 'menulist', id: 'menulist-field', editable: true, children: [
								{tag: 'menupopup'}
							]},
							{tag: 'button', id: 'button-up-field', label: 'Up'},
							{tag: 'button', id: 'button-down-field', label: 'Down'},
							{tag: 'button', id: 'button-remove-field', label: 'Remove'},
							{tag: 'spacer', width: 10},
							{tag: 'button', id: 'button-copy-field', label: 'Copy'},
							{tag: 'button', id: 'button-cut-field', label: 'Cut'},
							{tag: 'button', id: 'button-paste-field', label: 'Paste'}
						]},
						{tag: 'listbox', id: 'listbox-comment', flex: 1, children: [
							{tag: 'listhead', children: [
								{tag: 'listheader', label: 'Field', width: 110},
								{tag: 'listheader', label: 'Properties', width: 520}
							]},
							{tag: 'listbody'}
						]},
						{tag: 'hbox', children: [
							{tag: 'button', id: 'button-generate', label: 'Generate', tooltiptext: 'Generate a common block comment'},
							{tag: 'menulist', id: 'menulist-generate', children: [
								{tag: 'menupopup'}
							]},
							{tag: 'button', id: 'button-reset', label: 'Reset', tooltiptext: 'Reset the fields to the stored comment'},
							{tag: 'spacer', flex: 1},
							{tag: 'button', id: 'button-apply', label: 'Apply', tooltiptext: 'Store the displayed comment and apply it to the code'}
						]}
					]},
					{tag: 'splitter'},
					{tag: 'vbox', id: 'vbox-preview', width: 370, children: [
						{tag: 'description', id: 'description-preview', css: 'caption', value: 'Preview'},
						{tag: 'textbox', id: 'textbox-preview', css: 'code', flex: 1, multiline: true, readonly: true, width: '100%'}
					]}
				]},
				{tag: 'splitter'},
				{tag: 'vbox', id: 'vbox-code', flex: 0, height: 260, children: [
					{tag: 'description', css: 'caption', value: 'Code'},
					{tag: 'hbox', width: '100%', children: [
						{tag: 'tabbox', width: '100%', children: [
							{tag: 'tabs', id: 'tabs-code', orient: 'horizontal'}
						]},
						{tag: 'button', id: 'button-file-properties', label: 'Properties'},
						{tag: 'button', id: 'button-file-remove', label: 'Remove'}
					]},
					{tag: 'textbox', id: 'textbox-code', css: 'code', flex: 1, multiline: true, readonly: true, width: '100%'}
				]}
			]}
		]},
		{tag: 'statusbar', children: [
			{tag: 'statusbarpanel', id: 'statuspanel-title', flex: 1, label: 'JUL Comment System'},
			{tag: 'statusbarpanel', id: 'statuspanel-project', flex: 1, label: 'Project'}
		]}
	]
}
/* end 'JUL Comment System - Main page' UI */
;

oProject.logic =
/* begin 'JUL Comment System - Main page' logic */
{
	'button-add-field': {
		listeners: {
			command: function () {
				JUL.Comments.project.addField();
			}
		}
	},
	'button-apply': {
		listeners: {
			command: function () {
				JUL.Comments.project.applyComment();
			}
		}
	},
	'button-copy-field': {
		listeners: {
			command: function () {
				JUL.Comments.project.copyField();
			}
		}
	},
	'button-cut-field': {
		listeners: {
			command: function () {
				JUL.Comments.project.copyField(true);
			}
		}
	},
	'button-down-field': {
		listeners: {
			command: function () {
				JUL.Comments.project.moveField();
			}
		}
	},
	'button-file-properties': {
		listeners: {
			command: function () {
				JUL.Comments.project.onFileProperties();
			}
		}
	},
	'button-file-remove': {
		listeners: {
			command: function () {
				JUL.Comments.project.onFileRemove();
			}
		}
	},
	'button-find': {
		listeners: {
			command: function () {
				var sObject = JUL.trim(ample.getElementById('textbox-object').getAttribute('value'));
				if (!sObject) { return; }
				JUL.Comments.project.findObject(sObject);
			}
		}
	},
	'button-generate': {
		listeners: {
			command: function () {
				JUL.Comments.project.generateComment();
			}
		}
	},
	'button-go': {
		listeners: {
			command: function () {
			var sUrl = JUL.trim(ample.getElementById('textbox-address').getAttribute('value'));
				if (!sUrl) { return; }
				JUL.Comments.project.loadSite(sUrl);
			}
		}
	},
	'button-paste-field': {
		listeners: {
			command: function () {
				JUL.Comments.project.pasteField();
			}
		}
	},
	'button-remove-field': {
		listeners: {
			command: function () {
				JUL.Comments.project.removeField();
			}
		}
	},
	'button-reset': {
		listeners: {
			command: function () {
				JUL.Comments.project.resetComment();
			}
		}
	},
	'button-up-field': {
		listeners: {
			command: function () {
				JUL.Comments.project.moveField(true);
			}
		}
	},
	'checkbox-expand-proto': {
		listeners: {
			change: function () {
				var bCheck = this.getAttribute('checked') === 'true';
				JUL.Comments.project.onExpandProto(bCheck);
			}
		}
	},
	'checkbox-separate-file': {
		listeners: {
			change: function () {
				var bCheck = this.getAttribute('checked') === 'true';
				JUL.Comments.project.onSeparateFile(bCheck);
			}
		}
	},
	'checkbox-sort-keys': {
		listeners: {
			change: function () {
				var bCheck = this.getAttribute('checked') === 'true';
				JUL.Comments.project.onSortKeys(bCheck);
			}
		}
	},
	'menulist-field': {
		listeners: {
			blur: function () {
				this.setAttribute('value', this.$getContainer('input').value);
			}
		}
	},
	'tabs-code': {
		listeners: {
			select: function () {
				JUL.Comments.project.onSelectTab(this.parentNode.selectedTab);
			}
		}
	},
	'tbutton-close-project': {
		listeners: {
			command: function () {
				JUL.Comments.project.onCloseProject();
			}
		}
	},
	'tbutton-delete-project': {
		listeners: {
			command: function () {
				JUL.Comments.project.onDeleteProject();
			}
		}
	},
	'tbutton-download-code': {
		listeners: {
			command: function () {
				JUL.Comments.project.onDownloadCode();
			}
		}
	},
	'tbutton-edit-project': {
		listeners: {
			command: function () {
				JUL.Comments.project.onEditProject();
			}
		}
	},
	'tbutton-generate-comments': {
		listeners: {
			command: function () {
				JUL.Comments.project.onGenerateComments();
			}
		}
	},
	'tbutton-help-about': {
		listeners: {
			command: function () {
				JUL.Comments.project.onHelpAbout();
			}
		}
	},
	'tbutton-help-contents': {
		listeners: {
			command: function () {
				JUL.Comments.project.onHelpContents();
			}
		}
	},
	'tbutton-new-project': {
		listeners: {
			command: function () {
				JUL.Comments.project.onNewProject();
			}
		}
	},
	'tbutton-open-project': {
		listeners: {
			command: function () {
				JUL.Comments.project.onOpenProject();
			}
		}
	},
	'tbutton-remove-comments': {
		listeners: {
			command: function () {
				JUL.Comments.project.onRemoveComments();
			}
		}
	},
	'tbutton-save-project': {
		listeners: {
			command: function () {
				JUL.Comments.project.onSaveProject();
			}
		}
	},
	'tbutton-undo-tree': {
		listeners: {
			command: function () {
				JUL.Comments.project.onUndoTree();
			}
		}
	},
	'textbox-address': {
		listeners: {
			keypress: function (oEvent) {
				if (oEvent.keyIdentifier !== 'Enter') { return; }
				var sUrl = JUL.trim(this.getAttribute('value'));
				if (!sUrl) { return; }
				JUL.Comments.project.loadSite(sUrl);
			}
		}
	},
	'textbox-object': {
		listeners: {
			keypress: function (oEvent) {
				if (oEvent.keyIdentifier !== 'Enter') { return; }
				var sObject = JUL.trim(this.getAttribute('value'));
				if (!sObject) { return; }
				JUL.Comments.project.findObject(sObject);
			}
		}
	},
	'textbox-put-outside': {
		listeners: {
			change: function () {
				var sVal = JUL.trim(this.getAttribute('value'));
				JUL.Comments.project.onPutOutside(sVal);
			},
			keypress: function (oEvent) {
				if (oEvent.keyIdentifier !== 'Enter') { return; }
				var sVal = JUL.trim(this.getAttribute('value'));
				JUL.Comments.project.onPutOutside(sVal);
			}
		}
	},
	'tree-dom': {
		listeners: {
			select: function () {
				var oThis = this;
				setTimeout(function() {
					JUL.Comments.project.onSelectNode(oThis.selectedItems.length ? oThis.currentItem : null);
				}, 50);
			}
		}
	}
}
/* end 'JUL Comment System - Main page' logic */
;


};

if (module && module.exports) {
	module.exports = fInstance;
}
else if (global) {
	fInstance(global);
}
return fInstance;

})(typeof global !== 'undefined' ? global : window, typeof module !== 'undefined' ? module : null);
(function(global, module) {
'use strict';
if (module && module.exports && typeof require === 'function') { require('jul'); }

/* if in Node, export the instance factory, else apply it to the global namespace  */
var fInstance = function(oNSRoot) {
/* create a JUL instance bound to oNSRoot and make it available to the inner code */
var jul = new JUL.Instance({nsRoot: oNSRoot || global});

/* generated by JUL Designer version 2.1.1 */
/* 'JUL Comment System - Edit dialog' namespace */
var oProject = jul.ns('JUL.Comments.edit');

jul.apply(oProject,
/* begin 'JUL Comment System - Edit dialog' */
{
	keepBindings: false,
	listenersProperty: 'listeners',
	noLogic: false,
	ns: 'JUL.Comments.edit',
	suggestedFramework: 'xul',
	title: 'JUL Comment System - Edit dialog',
	version: '1.1502961404562',
	init: function () {
		this.parser = new jul.ui.Parser(this.parserConfig);
		this.dialog = this.parser.create(this.ui, this.logic);
		if (this.dialog) {
			ample.documentElement.appendChild(this.dialog);
			this.dialog.showModal();
		}
	}
}
/* end 'JUL Comment System - Edit dialog' */
);

oProject.parserConfig =
/* begin 'JUL Comment System - Edit dialog' parser config */
{
	customFactory: 'JUL.UI.createDom',
	defaultClass: 'xul',
	topDown: true,
	useTags: true
}
/* end 'JUL Comment System - Edit dialog' parser config */
;

oProject.ui =
/* begin 'JUL Comment System - Edit dialog' UI */
{
	tag: 'dialog',
	id: 'dialog-edit',
	height: 390,
	hidden: true,
	title: 'Edit',
	width: 800,
	children: [
		{tag: 'textbox', id: 'textbox-edit', css: 'code', flex: 1, multiline: true, width: '100%'}
	]
}
/* end 'JUL Comment System - Edit dialog' UI */
;

oProject.logic =
/* begin 'JUL Comment System - Edit dialog' logic */
{
	'dialog-edit': {
		listeners: {
			dialogaccept: function () {
				JUL.Comments.saveCode();
			}
		}
	}
}
/* end 'JUL Comment System - Edit dialog' logic */
;


};

if (module && module.exports) {
	module.exports = fInstance;
}
else if (global) {
	fInstance(global);
}
return fInstance;

})(typeof global !== 'undefined' ? global : window, typeof module !== 'undefined' ? module : null);
(function(global, module) {
'use strict';
if (module && module.exports && typeof require === 'function') { require('jul'); }

/* if in Node, export the instance factory, else apply it to the global namespace  */
var fInstance = function(oNSRoot) {
/* create a JUL instance bound to oNSRoot and make it available to the inner code */
var jul = new JUL.Instance({nsRoot: oNSRoot || global});

/* generated by JUL Designer version 2.1.1 */
/* 'JUL Comment System - Open dialog' namespace */
var oProject = jul.ns('JUL.Comments.open');

jul.apply(oProject,
/* begin 'JUL Comment System - Open dialog' */
{
	keepBindings: false,
	listenersProperty: 'listeners',
	noLogic: false,
	ns: 'JUL.Comments.open',
	suggestedFramework: 'xul',
	title: 'JUL Comment System - Open dialog',
	version: '1.1502694564874',
	init: function () {
		this.parser = new jul.ui.Parser(this.parserConfig);
		this.dialog = this.parser.create(this.ui, this.logic);
		if (this.dialog) {
			ample.documentElement.appendChild(this.dialog);
			this.dialog.showModal();
		}
	}
}
/* end 'JUL Comment System - Open dialog' */
);

oProject.parserConfig =
/* begin 'JUL Comment System - Open dialog' parser config */
{
	customFactory: 'JUL.UI.createDom',
	defaultClass: 'xul',
	topDown: true,
	useTags: true
}
/* end 'JUL Comment System - Open dialog' parser config */
;

oProject.ui =
/* begin 'JUL Comment System - Open dialog' UI */
{
	tag: 'dialog',
	id: 'dialog-open',
	height: 410,
	hidden: true,
	title: 'Open',
	width: 800,
	children: [
		{tag: 'grid', id: 'grid-settings', children: [
			{tag: 'columns', children: [
				{tag: 'column', flex: 2},
				{tag: 'column', flex: 3}
			]},
			{tag: 'rows'}
		]}
	]
}
/* end 'JUL Comment System - Open dialog' UI */
;

oProject.logic =
/* begin 'JUL Comment System - Open dialog' logic */
{
	'dialog-open': {
		listeners: {
			dialogaccept: function () {
				JUL.Comments.project.onOpen();
				return false;
			}
		}
	}
}
/* end 'JUL Comment System - Open dialog' logic */
;


};

if (module && module.exports) {
	module.exports = fInstance;
}
else if (global) {
	fInstance(global);
}
return fInstance;

})(typeof global !== 'undefined' ? global : window, typeof module !== 'undefined' ? module : null);
(function(global, module) {
'use strict';
if (module && module.exports && typeof require === 'function') { require('jul'); }

/* if in Node, export the instance factory, else apply it to the global namespace  */
var fInstance = function(oNSRoot) {
/* create a JUL instance bound to oNSRoot and make it available to the inner code */
var jul = new JUL.Instance({nsRoot: oNSRoot || global});

/* generated by JUL Designer version 2.1.1 */
/* 'JUL Comment System - Browse dialog' namespace */
var oProject = jul.ns('JUL.Comments.browse');

jul.apply(oProject,
/* begin 'JUL Comment System - Browse dialog' */
{
	keepBindings: false,
	listenersProperty: 'listeners',
	noLogic: false,
	ns: 'JUL.Comments.browse',
	suggestedFramework: 'xul',
	title: 'JUL Comment System - Browse dialog',
	version: '1.1502694516747',
	init: function () {
		this.parser = new jul.ui.Parser(this.parserConfig);
		this.dialog = this.parser.create(this.ui, this.logic);
		if (this.dialog) {
			ample.documentElement.appendChild(this.dialog);
			this.dialog.showModal();
		}
	}
}
/* end 'JUL Comment System - Browse dialog' */
);

oProject.parserConfig =
/* begin 'JUL Comment System - Browse dialog' parser config */
{
	customFactory: 'JUL.UI.createDom',
	defaultClass: 'xul',
	topDown: true,
	useTags: true
}
/* end 'JUL Comment System - Browse dialog' parser config */
;

oProject.ui =
/* begin 'JUL Comment System - Browse dialog' UI */
{
	tag: 'dialog',
	id: 'dialog-browse',
	height: 410,
	hidden: true,
	title: 'Browse',
	width: 800,
	children: [
		{tag: 'listbox', id: 'listbox-browse', flex: 1, seltype: 'single', children: [
			{tag: 'listhead', children: [
				{tag: 'listheader', label: 'Name', width: 390},
				{tag: 'listheader', label: 'Title', width: 390}
			]},
			{tag: 'listbody'}
		]}
	]
}
/* end 'JUL Comment System - Browse dialog' UI */
;

oProject.logic =
/* begin 'JUL Comment System - Browse dialog' logic */
{
	'dialog-browse': {
		listeners: {
			dialogaccept: function () {
			JUL.Comments.project.open();
				return false;
			}
		}
	},
	'listbox-browse': {
		listeners: {
			dblclick: function (oEvent) {
				if (oEvent.target.nodeName !== 'xul:listcell') { return; }
				JUL.Comments.project.open();
			}
		}
	}
}
/* end 'JUL Comment System - Browse dialog' logic */
;


};

if (module && module.exports) {
	module.exports = fInstance;
}
else if (global) {
	fInstance(global);
}
return fInstance;

})(typeof global !== 'undefined' ? global : window, typeof module !== 'undefined' ? module : null);
