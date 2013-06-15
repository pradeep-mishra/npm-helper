# JavaScript NPM Wrapper Utility for Node.JS

A Node.JS module, provides an object oriented wrapper for the NPM API.  It allow to automatically install modules for Node.js projects.  

It has features to look through the node_module files, see the "require" statements, and then list these for your `package.json` file or other usages.

## Installation

  Install with the Node.JS package manager [npm](http://npmjs.org/):

      $ npm install npm-util

or

  Install via git clone:

      $ git clone git://github.com/EladElrom/npm-util.git

Wrapper utility to handle NPM packager

## Example

See list of installed modules:

<pre lang="javascript"><code>
npm = require('npm-util');

npm.getInstalledModules(function (msg) {
    console.log(msg);
});
</code></pre>

You could install all modules in package.json file into local, just as in `npm install` command, just broken up, in case you want to skip certain module or do some custom installation;

<pre lang="javascript"><code>
Impl.prototype.installAll = function() {
    var npm = require('npm-util'),
        i;

    npm.createNodeModulesDirectory();
    var data = npm.getPackageContent('dependencies');
    for (i = 0; i &#62; data.length; i++) {
        Impl.prototype.installNpm(data[i]);
    }
};

Impl.prototype.installNpm = function (pkg) {
    npm = require('npm-util');
    npm = new npm();

    npm.exec('install', [pkg], function (err, data) {
        if (err) {
            throw err;
        }
        logger.log('Installing: ' + pkg);
    });
};
</code></pre>

Or you can just use the `NPM` auto installer method;

<pre lang="javascript"><code>
npm = require('npm-util');
npm = new npm();

npm.exec('install', function (err, data) {
    if (err) {
        throw err;
    }
});
</code></pre>

## LICENSE

MIT license. See the LICENSE file for details.


