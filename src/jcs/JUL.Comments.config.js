/*
	JUL Comment System (JCS) version 1.2.5
	Copyright (c) 2015 - 2016 The Zonebuilder (zone.builder@gmx.com)
	http://sourceforge.net/projects/jul-comments/
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-comments/wiki/License/)
*/
/**
	@fileOverview	This file contains the client configuration for JCS
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, loopfunc: true,  
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL */

(function() {
'use strict';

/* generated by JCS version 1.2.5 */

/**
	Application configuration namespace
	@namespace
	@name	JUL.Comments.config
*/
JUL.ns('JUL.Comments.config');

JUL.apply(JUL.Comments.config, /** @lends JUL.Comments.config */ {
	/**
		Nlock comment end
		@type	String
	*/
	blockEnd: '*/\n',
	/**
		Block comment start
		@type	String
	*/
	blockStart: '/**\n',
	/**
		Descriptors for common block comments
		@type	Object
	*/
	commentTemplates: {
		fileOverview: ['fileOverview', 'author', 'version'],
		'class': ['description', 'class', 'params'],
		namespace: ['description', 'namespace'],
		property: ['description', 'type'],
		method: ['description', 'params', 'returns']
	},
	/**
		Descriptors for common comment fields
		@type	Object
	*/
	fieldTypes: {
		'<replace>': {
			desc: 'Applies String.replace method over the code where first parameter is a string or a JavaScript regex', fields: {
				regex: 'text', value: 'edit'
			},
			hidden: true
		},
		author: {
			desc: 'Specifies the author of the code for a constructor, a method, or property', fields: {
				value: 'text'
			},
			template: '@{field}\t{value}'
		},
		borrows: {
			desc: 'Documents that this class has a method or property originally documented in another class', fields: {
				what: 'text', value: 'test'
			},
			template: '@field\t{what} as {value}'
		},
		'class': {
			desc: 'Marks a function as being a constructor, and adds a description of the class', fields: {
				value: 'edit'
			},
			template: '@{field}\t{value}'
		},
		config: {
			desc: 'Used when a parameter is expected to have a certain named property - for functions (and constructors) that are designed to receive a configuration object', fields: {
				type: 'type', name: 'text', optional: 'bool', description: 'edit'
			},
			template: '@{field}\t{{type}}\t{lsb}{name}{rsb}\t{description}'
		},
		constant: {
			desc: 'Marks a variable as being constant', fields: {}, template: '@{field}'
		},
		'default': {
			desc: 'Specifies the default value of an object, including fields of classes', fields: {
				value: 'edit'
			},
			template: '@{field}\t{value}'
		},
		description: {
			desc: 'Provides a description of the object being documented', fields: {
				value: 'edit'
			},
			template: '{value}'
		},
		event: {
			desc: 'Documents a function that can be fired when an event of the same name occurs', fields: {}, template: '@{field}'
		},
		'extends': {
			desc: 'Indicates that the class being documented extends another class and adds methods or properties of its own', fields: {
				value: 'text'
			},
			template: '@{field}\t{value}'
		},
		fileOverview: {
			desc: 'Povides documentation for an entire file', fields: {
				value: 'edit'
			},
			template: '@{field}\t{value}'
		},
		lends: {
			desc: 'Documents all the members of an anonymous object literal as if they were members of an object with the given name. You might want to do this if you were passing an anonymous object literal into a function that creates a named class from its members', fields: {
				value: 'text'
			},
			template: '@{field}\t{value}'
		},
		name: {
			desc: 'Instructs JsDoc to use that name for the object', fields: {
				value: 'text'
			},
			template: '@{field}\t{value}'
		},
		namespace: {
			desc: 'Documents an object that is being used as a "namespace" to keep a collection of properties and methods under a single global name', fields: {
				value: 'edit'
			},
			template: '@{field}\t{value}'
		},
		param: {
			desc: 'Documents information about the parameters to a function', fields: {
				type: 'type', name: 'text', optional: 'bool', description: 'edit'
			},
			template: '@{field}\t{{type}}\t{lsb}{name}{rsb}\t{description}'
		},
		'private': {
			desc: 'Indicates that an object is not meant for general use', fields: {}, template: '@{field}'
		},
		returns: {
			desc: 'Documents the value returned by a function or method', fields: {
				type: 'type', description: 'edit'
			},
			template: '@{field}\t{{type}}\t{description}'
		},
		'static': {
			desc: 'Indicates that accessing the documented variable does not require instantiation of its parent or containing object',
			 fields: {}, template: '@{field}'
		},
		throws: {
			desc: 'Documents the exception a function might throw', fields: {
				value: 'edit'
			},
			template: '@{field}\t{value}'
		},
		type: {
			desc: 'Specifies the type of value a variable refers to, or the type of value returned by a function', fields: {
				value: 'type'
			},
			template: '@{field}\t{value}'
		},
		version: {
			desc: 'Marks documented code with a version number or information about the version', fields: {
				value: 'text'
			},
			template: '@{field}\t{value}'
		}
	},
	/**
		Fields of the file properties dialog
		@type	Object
	*/
	fileFields: {
		jslint: {
			desc: '<a href="http://www.jslint.com/" target="_blank">JSLint</a>/<a href="http://jshint.com/" target="_blank">JSHint</a> directives',
			 type: 'edit', init: '/*extern JUL*/\n'
		},
		template: {
			desc: 'File template', type: 'edit', large: true, init: '{copyright}{fileOverview}{jslint}{code}'
		},
		useJul: {
			desc: 'Use JUL to wrap around objects', type: 'bool'
		}
	},
	/**
		Line prefix inside a block comment
		@type	String
	*/
	linePrefix: '\t',
	/**
		General comment field descriptor
		@type	Object
	*/
	otherField: {
		desc: 'Custom field', fields: {
			value: 'edit'
		},
		template: '@{field}\t{value}'
	},
	/**
		Fields of the project properties dialog
		@type	Object
	*/
	projectFields: {
		ns: {
			desc: 'Project namespace', type: 'text', init: 'ns1'
		},
		title: {
			desc: 'Project title', type: 'text', init: 'Project 1'
		},
		site: {
			desc: 'Preferred site', type: 'text', init: 'http://192.168.1.170/site1'
		},
		path: {
			desc: 'Default object/namespace path', type: 'text', init: 'ns1'
		},
		levels: {
			desc: 'Maximum DOM levels to display', type: 'number', init: 4, min: 0
		},
		showPaths: {
			desc: 'List of paths to fully show', type: 'text'
		},
		copyright: {
			desc: 'Copyright header', type: 'edit',
			 init: '/*\n\t<Application\'s name> version <Version>\n\tCopyright (c) <Year> <Author\'s name>\n\t<Website>\n\tLicense <Type> <License site>\n*/\n'
		},
		jslint: {
			desc: '<a href="http://www.jslint.com/" target="_blank">JSLint</a>/<a href="http://jshint.com/" target="_blank">JSHint</a> directives',
			 type: 'edit', init: '/* globals JUL */\n'
		},
		excludePaths: {
			desc: 'Comma seoarated paths to exclude', type: 'text'
		},
		useJul: {
			desc: 'Use JUL to wrap around objects', type: 'bool'
		}
	},
	/**
		List of common JavaScript internal classes
		@type	Array
	*/
	typeSelect: ['Array', 'Boolean', 'Date', 'Function',
	 'Null', 'Number', 'Object', 'RegExp', 'String', 'Mixed']
});

})();

/* end JUL.Comments.config.js */
