var fs   =  require('fs');
var path =  require('path');
var exec =  require('child_process').exec;

var Npm = module.exports = function (options) {
    "use strict";
    this.binary = 'npm';

    if (options === 'undefined') {
        options = {};
    }

    this.args = Npm.convertObjectToStringKeyPairs(options);
};

Npm.prototype.exec = function (command, options, args, callback) {
    "use strict";

    var cmd,
        setArgs;

    setArgs = Npm.mutateArguments(command, options, args, callback);
    setArgs.args = setArgs.args.join(' ');
    setArgs.options = Npm.convertObjectToStringKeyPairs(setArgs.options);

    cmd = this.binary + ' ' + this.args + ' ' + setArgs.command + ' ' + setArgs.options + ' ' + setArgs.args;

    exec(cmd, function (err, stdout, stderr) {
        setArgs.callback(err, stdout);
    });
};

// property example 'dependencies'
Npm.getPackageContent = function (property) {
    "use strict";
    try {
        var data = {},
            dependencies = [],
            packageContent;

        packageContent = require(process.cwd() + '/package.json');

        Object.keys(packageContent).forEach(function (value) {
            data[value] = packageContent[value];

            if (value === property) {
                Object.keys(data[value]).forEach(function (value1) {
                    dependencies.push(value1.trim() + '@' + data[value][value1]);
                });
            }
        });
        return dependencies;
    } catch (err) {
        return {};
    }
};

Npm.createNodeModulesDirectory = function () {
    "use strict";
    if (!fs.existsSync('node_modules')) {
        fs.mkdirSync('node_modules');
    }
};

Npm.getInstalledModules = function (progressCallBack) {
    "use strict";
    var packageJsonFile,
        parsedData;

    fs.readdir("./node_modules", function (err, dirs) {
        if (err) {
            throw err;
        }
        dirs.forEach(function (dir) {
            if (dir.indexOf('.') !== 0) {
                packageJsonFile = './node_modules/' + dir + '/package.json';
                if (fs.existsSync(packageJsonFile)) {
                    parsedData = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
                    progressCallBack(parsedData.name + '@' + parsedData.version);
                }
            }
        });
    });
};

Npm.convertObjectToStringKeyPairs = function (options) {
    "use strict";
    var args = [],
        keys,
        value;

    for (keys in options) {
        if (keys.length === 1) {
            value = options[keys];
            if (value === true) {
                args.push('-' + keys);
            } else if (value !== false) {
                args.push('-' + keys + ' ' + value);
            }
        } else {
            value = options[keys];
            if (value === true) {
                args.push('--' + keys);
            } else if (value !== false) {
                args.push('--' + keys + '=' + value);
            }
        }
    }

    return args.join(' ');
};

Npm.mutateArguments = function (command, options, args, callback) {
    "use strict";

    var length = Npm.numOfArgumentsDefined(arguments);

    callback = arguments[length - 1];

    if (length <= 2) {
        options = {};
        args = [];
    } else if (length === 3) {
        args = arguments[1];
        options = [];
    }

    return {
        command : command,
        callback : callback,
        options : options,
        args : args
    };
};

Npm.numOfArgumentsDefined = function (args) {
    "use strict";
    var length = args.length,
        totalArgumentsToCheck = length + 1,
        reduce = 0;

    while (--totalArgumentsToCheck > 0) {
        if (args[totalArgumentsToCheck - 1] !== undefined) {
            length = args.length - reduce;
            break;
        }
        reduce++;
    }
    return length;
};

Npm.installAllDependencies = function (progressMsg) {
    "use strict";
    var i,
        data;

    Npm.createNodeModulesDirectory();
    data = Npm.getPackageContent('dependencies');
    for (i = 0; i < data.length; i++) {
        progressMsg(data[i]);
        Npm.installNpm(data[i]);
    }
};

Npm.installNpm = function (pkg) {
    "use strict";
    Npm.exec('install', [pkg], function (err, data) {
        if (err) {
            throw err;
        }
    });
};