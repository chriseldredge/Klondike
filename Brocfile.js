/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');
var msbuild = require('broccoli-msbuild');
var select = require('broccoli-select');
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

var assetTree = pickFiles('vendor', {
  srcDir: '/',
  files: [
  	'bootstrap-sass-official/assets/fonts/bootstrap/*',
  	'font-awesome/fonts/*',
  	'zeroclipboard/ZeroClipboard.swf'
  ],
  destDir: '/assets'
});

var msbuildInputTree = select('src', {
  acceptFiles: [ '**/*.csproj', '**/*.cs', '**/*.config' ],
  outputDir: '/build'
});

var package = require('./package.json');
var versionParts = package.version.split('-');
var versionPrefix = versionParts[0];
var versionSuffix = versionParts.length > 1 ? versionParts[1] : '';

var msbuildTree = msbuild(msbuildInputTree, {
  project: require('path').join(__dirname, 'Ciao.proj'),
  targets: 'Build',
  configuration: 'Release', /* TODO: inject from config/environment */
  properties: {
    VersionPrefix: versionPrefix,
    VersionSuffix:  versionSuffix,
    DistDir: '{destDir}'
  }
});

module.exports = app.toTree([msbuildTree, assetTree]);
