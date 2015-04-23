var fs   =  require('fs');
var path =  require('path');
var exec =  require('child_process').exec;

var Npm = module.exports = function (options) {
    options = options || {};
    this.binary = 'npm';
    try{
        this.cwdPath = options.cwd || process.cwd();   
    }catch(e){
        this.cwdPath = "/";
    }   
    
    this.args = Npm.convertObjectToStringKeyPairs(options);
};

Npm.prototype.cwd = function(path){
    if(typeof path === "undefined"){
        return this.cwdPath;
    }
    try{
        if(fs.statSync(path).isDirectory()){
            this.cwdPath = path;
            return true;
        }
    }catch(e){
        console.log('error on checking cwd', e.toString());    
    }  
    return false;
}

Npm.prototype.createNodeModulesDirectory = function () {
    "use strict";
    if (!fs.existsSync(path.join(this.cwdPath,'node_modules'))) {
        fs.mkdirSync(path.join(this.cwdPath,'node_modules'));
    }
};

Npm.prototype.exec = function (command, options, args, callback) {
    "use strict";
    var me=this;
    var cmd,
        setArgs;

    setArgs = Npm.mutateArguments(command, options, args, callback);
    setArgs.args = setArgs.args.join(' ');
    setArgs.options = Npm.convertObjectToStringKeyPairs(setArgs.options);

    cmd = this.binary + ' ' + this.args + ' ' + setArgs.command + ' ' + setArgs.options + ' ' + setArgs.args;

    var execOptions={
        cwd:me.cwdPath
    }
    exec(cmd, execOptions, function (err, stdout, stderr) {
        setArgs.callback(err, stdout, stderr);
    });
};

Npm.prototype.install=function(options, args, callback){
    return this.exec('install',options,args,callback);
}


Npm.prototype.getPackageContent = function (property) {
    "use strict";
    try {
        var data = {},
            dependencies = [],
            packageContent;

        packageContent = require(path.join(this.cwdPath,'package.json') );

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

Npm.prototype.getDependencies=function(){
    return this.getPackageContent('dependencies');
}


Npm.prototype.getInstalledModules = function (callback) {
    "use strict";
    var packageJsonFile,
        parsedData,
        me=this;
    var data=[];
    fs.readdir(path.join(me.cwdPath,'node_modules'), function (err, dirs) {
        if (err) {
            throw err;
        }
        for(var i=0;i<dirs.length;i++){
            var dir=dirs[i];
           if (dir.indexOf('.') !== 0) {
                packageJsonFile = path.join(me.cwdPath,'node_modules',dir,'package.json') ;
                if (fs.existsSync(packageJsonFile)) {
                    parsedData = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
                    data.push({
                        name:parsedData.name,
                        version:parsedData.version
                    });
                }
            } 
        }
        if(typeof callback=="function"){
            callback(data);
        }
    });
};

Npm.prototype.installModule = function (pkg, callback) {
    "use strict";
    this.exec('install', [pkg], function (err, stdout, stderr) {
        if(typeof callback === "function"){
           callback(err, stdout, stderr); 
        }  
    });
};


//-----------------------------------------------------------------------------------------//


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

