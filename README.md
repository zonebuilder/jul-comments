<p align="center">
<img alt="JUL" src="https://zonebuilder.github.io/media/braces120.png" width="160" height="120" />
</p>

JCS - JUL Comment System
========================

About
-----

JCS - JUL Comment System is a way of documenting your JavaScript source code 
while keeping the comments in a separate file. 
It allows you to associate the comments to any version of the source code 
and to get the updated commented code. 
Also, JCS is able to generate and to document the code 
for an entire JavaScript namespace or DOM tree loaded by a web page. 

License
-------
 
 Licensed under GNU GPLv2 or later and under GNU LGPLv3 or later. See enclosed 'licenses' folder.
 
Features
--------

* generates documented code from JavaScript source code or from runtime code
* saves the comments as a separate project for reuse and management of documenting different versions of the code
* recognizes types of data and generates comments blocks accordingly
* splits a JavaScript namespace into a custom number of child namespaces as documented source files with their corresponding code
* downloading the collection of generated source files as a zip package

System requirements
-------------------

* a CSS2 compliant web browser with JavaScript 1.5 or later engine
* Node.js 0.10.0 or later installed 
* OR a web server with PHP 5.2.0 or later extension 
* 1024x768 minimum resolution

Build & install
---------------

Install [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) command line in your system.
Run the following shell commands in order:

``` bash
	npm install
	npm run deps
	npm run make
```
The release will be in a 'build' folder. See Readme in that folder for further instructions.

Downloads & user support
------------------------

[jul-comments project on SourceForge](http://sourceforge.net/projects/jul-comments/)

