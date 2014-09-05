/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');
var gitDescribe = require('./broccoli-git-describe.js');

var app = new EmberApp();

app.import('vendor/momentjs/moment.js');
app.import('vendor/nprogress/nprogress.js');
app.import('vendor/nprogress/nprogress.css');

app.import({
    development: 'vendor/jquery-signalr/jquery.signalR.js',
    production: 'vendor/jquery-signalr/jquery.signalR.min.js'
});

app.import({
    development: 'vendor/zeroclipboard/ZeroClipboard.js',
    production: 'vendor/zeroclipboard/ZeroClipboard.min.js'
});

app.index = function() {
    var defaultIndexTree = EmberApp.prototype.index.apply(app);
    return gitDescribe(defaultIndexTree);
}

function assetTree() {
  return pickFiles('vendor', {
    srcDir: '/',
    files: [
    	'bootstrap-sass-official/assets/fonts/bootstrap/*',
    	'font-awesome/fonts/*',
    	'zeroclipboard/ZeroClipboard.swf'
    ],
    destDir: '/assets'
  });
}

function msbuildTree() {
  var msbuild = require('broccoli-msbuild');
  var select = require('broccoli-select');

  var msbuildInputTree = select('src', {
    acceptFiles: [ '**/*.csproj', '**/*.cs', '**/*.config' ],
    outputDir: '/build'
  });

  var versionParts = app.project.pkg.version.split('-');
  var versionPrefix = versionParts[0];
  var versionSuffix = versionParts.length > 1 ? versionParts[1] : '';

  var config = require('./config/environment')(app.env);

  if (config.disableMSBuild) {
    return null;
  }

  return msbuild(msbuildInputTree, {
    project: require('path').join(__dirname, 'Ciao.proj'),
    toolsVersion: '4.0',
    configuration: config.configuration,
    properties: {
      VersionPrefix: versionPrefix,
      VersionSuffix:  versionSuffix,
      DistDir: '{destDir}'
    }
  });
}

function buildTrees() {
    var trees = [assetTree()];
    var msbuild = msbuildTree();
    if (msbuild !== null) {
        trees.push(msbuild);
    }
    return trees;
}

module.exports = app.toTree(buildTrees());
