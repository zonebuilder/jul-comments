/*
	JUL Comment System (JCS) version 1.5.8
	Copyright (c) 2015 - 2020 The Zonebuilder <zone.builder@gmx.com>
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
	 * a CSS2 compliant web browser with JavaScript 1.5 or later engine 
	  * Node.js 0.10.0 or later installed 
	  * OR a web server with PHP 5.2.0 or later extension 
	 * 1024x768 minimum resolution
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, loopfunc: true,  
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals ample, JUL */
