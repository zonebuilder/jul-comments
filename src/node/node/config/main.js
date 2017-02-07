/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, loopfunc: true,  
	onevar: true, newcap: true, noarg: true, node: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL, DOCROOT */
'use strict';
require('jul');
var oApp = JUL.ns('JUL.Comments');

JUL.apply(exports, {
	title: 'JCS',
	version: '1.3.1',
	zb_link: 'http://www.google.com/search?hl=en&num=50&start=0&safe=0&filter=0&nfpr=1&q=The+Zonebuilder+web+development+programming+IT+society+philosophy+politics',
	work_dir: DOCROOT + 'assets',
	ample_root: oApp.uri + '/amplesdk-mainta-0.9.4/ample/',
	jul_root: ''
});
