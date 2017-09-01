#!/usr/bin/env node
/*
	JUL Comment System (JCS) version 1.3.6
	Copyright (c) 2015 - 2017 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-comments/
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-comments/wiki/License/)
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, loopfunc: true,  
	onevar: true, newcap: true, noarg: true, node: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL, DIRECTORY_SEPARATOR, DOCROOT, APPPATH */
'use strict';
require('jul');
var oApp = JUL.ns('JUL.Comments');

/**
 * A Node server application for JUL.Comments
 */
JUL.ns('DIRECTORY_SEPARATOR', require('path').sep);
JUL.ns('DOCROOT', __dirname + DIRECTORY_SEPARATOR);
JUL.ns('APPPATH', DOCROOT + 'node' + DIRECTORY_SEPARATOR);
JUL.apply(oApp, {
	data: {},
	Config: function(sName) { return require(APPPATH + 'config' + DIRECTORY_SEPARATOR + sName); },
	Controller: function(sName) { return require(APPPATH + 'controllers' + DIRECTORY_SEPARATOR + sName); },
	Model: function(sName) { return require(APPPATH + 'models' + DIRECTORY_SEPARATOR + sName); },
	View: function(sName) { return require('fs').readFileSync(APPPATH + 'views' + DIRECTORY_SEPARATOR + sName, 'utf8'); },
	Helper: function(sName) { return require(APPPATH + 'helpers' + DIRECTORY_SEPARATOR + sName); },
});

var oConnection = {
	host: 'localhost',
	port: 7780
};
var oOpts = require('cli').setApp(DOCROOT + 'package.json').enable('help', 'version').parse({
	address: ['a', 'Hostname or IP to listen to', 'string', oConnection.host],
	port: ['p', 'Port number to listen to', 'int', oConnection.port],
	workdir: ['w', 'Directory where projects, frameworks & apps are', 'path',
		'(npm config get prefix)/node_modules/jul-designer/assets']
});
if (oOpts.address) { oConnection.host = oOpts.address; }
if (oOpts.port) { oConnection.port = oOpts.port; }
oApp.uri = 'http://' + oConnection.host + ':' + oConnection.port;
if (oOpts.workdir[0] !== '(') {
	// this is a hack, it should be changed in future versions
	oApp.Config('main').work_dir = require('path').resolve(oOpts.workdir);
}

var oExpress = require('express');
oApp.server = oExpress();
oApp.server.use(require('body-parser').urlencoded({ extended: true}));
var oEjs = require('ejs');
oApp.server.engine('html', oEjs.renderFile);
oEjs.delimiter = '?';
oApp.server.set('views', APPPATH + 'views');
oApp.server.set('view engine', 'html');
var aStatic = ['amplesdk-mainta-0.9.4', 'assets', 'docs', 'media', 'source/js/jul.js'];
for (var i = 0; i < aStatic.length; i++) {
	oApp.server.use('/' + aStatic[i], oExpress.static(DOCROOT + aStatic[i].replace(/\//g, DIRECTORY_SEPARATOR)));
}
oApp.server.get('/', JUL.makeCaller(oApp.Controller('main'), 'index'));
oApp.server.all('/index.php/main/manage', JUL.makeCaller(oApp.Controller('main'), 'manage'));
oApp.server.listen(oConnection.port, oConnection.host, function() {
	var oConfig = oApp.Config('main');
	console.log('Running ' + oConfig.title + ' version ' + oConfig.version);
	console.log('available at: ' + oApp.uri + '/');
});
