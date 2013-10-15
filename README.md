# JavaScript NPM Wrapper Utility for Node.JS

A Node.JS module, provides an object oriented wrapper for the NPM API.  It allow to automatically install modules for Node.js projects.  

It has features to look through the node_module files, see the "require" statements, and then list these for your `package.json` file or other usages.

## Installation

  Install with the Node.JS package manager [npm](http://npmjs.org/):

      $ npm install npm-helper

or

  Install via git clone:

      $ git clone git://github.com/pradeep-mishra/npm-helper.git

Wrapper utility to handle NPM packager

## Example

See list of installed modules:

<pre lang="javascript"><code>
npm = new (require('npm-helper'));

npm.getInstalledModules(function (msg) {
    console.log(msg);
});
</code></pre>

<pre lang="javascript"><code>
npm = new (require('npm-helper'));

npm.cwd(process.cwd()); // set current working directory for npm (optional).

npm.createNodeModulesDirectory();

npm.exec('install', function (err, stdout, stderr) {
    if (err || stderr) {
        throw (err || stderr);
    }
});


</code></pre>

## LICENSE

MIT license. See the LICENSE file for details.


