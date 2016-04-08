/* this file controls comment generation; customize carefully */
JUL.ns('JUL.Comments.config');

JUL.apply(JUL.Comments.config, {
	fieldTypes: {
		description: {desc: 'Provides a description of the object being documented', fields: {value: 'edit'}, template: '{value}'},
		'class': {desc: 'Marks a function as being a constructor, and adds a description of the class', fields: {value: 'edit'}, template: '@{field}\t{value}'},
		'namespace': {desc: 'Documents an object that is being used as a "namespace" to keep a collection of properties and methods under a single global name', fields: {value: 'edit'}, template: '@{field}\t{value}'},
		fileOverview: {desc: 'Povides documentation for an entire file', fields: {value: 'edit'}, template: '@{field}\t{value}'},
		author: {desc: 'Specifies the author of the code for a constructor, a method, or property', fields: {value: 'text'}, template: '@{field}\t{value}'},
		name: {desc: 'Instructs JsDoc to use that name for the object', fields: {value: 'text'}, template: '@{field}\t{value}'},
		version: {desc: 'Marks documented code with a version number or information about the version', fields: {value: 'text'}, template: '@{field}\t{value}'},
		'type': {desc: 'Specifies the type of value a variable refers to, or the type of value returned by a function', fields: {value: 'type'}, template: '@{field}\t{value}'},
		param: {desc: 'Documents information about the parameters to a function', fields: {type: 'type', name: 'text', optional: 'bool', description: 'edit'}, template: '@{field}\t{{type}}\t{lsb}{name}{rsb}\t{description}'},
		config: {desc: 'Used when a parameter is expected to have a certain named property - for functions (and constructors) that are designed to receive a configuration object', fields: {type: 'type', name: 'text', optional: 'bool', description: 'edit'}, template: '@{field}\t{{type}}\t{lsb}{name}{rsb}\t{description}'},
		returns: {desc: 'Documents the value returned by a function or method', fields: {type: 'type', description: 'edit'}, template: '@{field}\t{{type}}\t{description}'},
		'extends': {desc: 'Indicates that the class being documented extends another class and adds methods or properties of its own', fields: {value: 'text'}, template: '@{field}\t{value}'},
		'lends': {desc: 'Documents all the members of an anonymous object literal as if they were members of an object with the given name. You might want to do this if you were passing an anonymous object literal into a function that creates a named class from its members', fields: {value: 'text'}, template: '@{field}\t{value}'},
		'default': {desc: 'Specifies the default value of an object, including fields of classes', fields: {value: 'edit'}, template: '@{field}\t{value}'},
		'private': {desc: 'Indicates that an object is not meant for general use', fields: {}, template: '@{field}'},
		'constant': {desc: 'Marks a variable as being constant', fields: {}, template: '@{field}'},
		event: {desc: 'Documents a function that can be fired when an event of the same name occurs', fields: {}, template: '@{field}'},
		'static': {desc: 'Indicates that accessing the documented variable does not require instantiation of its parent or containing object', fields: {}, template: '@{field}'},
		borrows: {desc: 'Documents that this class has a method or property originally documented in another class', fields: {what: 'text', value: 'test'}, template: '@field\t{what} as {value}' },
		'throws': {desc: 'Documents the exception a function might throw', fields: {value: 'edit'}, template: '@{field}\t{value}'},
		'<replace>': {desc: 'Applies String.replace method over the code where first parameter is a string or a JavaScript regex', fields: {regex: 'text', value: 'edit'}, hidden: true}
	},
	otherField: {desc: 'Custom field', fields: {value: 'edit'}, template: '@{field}\t{value}'},
	typeSelect: ['Array', 'Boolean', 'Date', 'Function', 'Null', 'Number', 'Object', 'RegExp', 'String', 'Mixed'],
	commentTemplates: {
		fileOverview: ['fileOverview', 'author', 'version'],
		'class': ['description', 'class', 'params'],
		'namespace': ['description', 'namespace'],
		property: ['description', 'type'],
		method: ['description', 'params', 'returns']
	},
	blockStart: '/**\n',
	blockEnd: '*/\n',
	linePrefix: '\t'
});
