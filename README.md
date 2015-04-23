[![NPM](https://nodei.co/npm/npm-helper.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/npm-helper/)&nbsp;&nbsp;
[![Build Status](https://travis-ci.org/pradeep-mishra/npm-helper.svg?branch=master)](https://travis-ci.org/pradeep-mishra/npm-helper)

npm-helper
========

# JavaScript NPM Helper for Node.JS

A Node.JS module,  It allow to automatically install modules for Node.js projects from your application.  

It has features to look through the node_module files, see the "require" statements, and then list these for your `package.json` file or other usages.

## Installation

  Install with the Node.JS package manager [npm](http://npmjs.org/):

      $ npm install npm-helper

or

  Install via git clone:

      $ git clone git://github.com/pradeep-mishra/npm-helper.git



## Example

See list of installed modules:

<pre lang="javascript"><code>
NPM = require('npm-helper');

npm=new NPM();

npm.getInstalledModules(function (data) {
    console.log(data);
});
</code></pre>


Create node_modules directory if not present:

<pre lang="javascript"><code>
NPM = require('npm-helper');

npm=new NPM();

npm.createNodeModulesDirectory();
</code></pre>



Get List of dependencies:

<pre lang="javascript"><code>
NPM = require('npm-helper');

npm=new NPM();

var list=npm.getDependencies();

console.log(list);
</code></pre>


Get Attributes of package.json:

<pre lang="javascript"><code>
NPM = require('npm-helper');

npm=new NPM();

var name=npm.getPackageContent('name');

console.log(name);
</code></pre>



Get List of Installed modules:

<pre lang="javascript"><code>
NPM = require('npm-helper');

npm=new NPM();

npm.getInstalledModules(function(data){
    console.log(data);
});
</code></pre>



Install Specific Module:

<pre lang="javascript"><code>
NPM = require('npm-helper');

npm=new NPM();

npm.createNodeModulesDirectory();

npm.installModule('express', function (err,data) {
    console.log(err,data);
});
</code></pre>


Install All modules
<pre lang="javascript"><code>
NPM = require('npm-helper');

npm=new NPM();

npm.cwd(process.cwd()); // set current working directory for npm (optional).

npm.createNodeModulesDirectory();

npm.exec('install', function (err, data) {
    if (err) {
        throw err;
    }
});

OR

npm.install(function (err, data) {
    if (err) {
        throw err;
    }
});


</code></pre>

## LICENSE

MIT license. See the LICENSE file for details.


