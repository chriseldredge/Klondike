/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var exec = require('broccoli-exec');
var mergeTrees = require('broccoli-merge-trees');
var select = require('broccoli-select');

var app = new EmberApp();

app.import('bower_components/momentjs/moment.js');
app.import('bower_components/nprogress/nprogress.js');
app.import('bower_components/nprogress/nprogress.css');

app.import({
    development: 'bower_components/jquery-signalr/jquery.signalR.js',
    production: 'bower_components/jquery-signalr/jquery.signalR.min.js'
});

app.import({
    development: 'bower_components/zeroclipboard/ZeroClipboard.js',
    production: 'bower_components/zeroclipboard/ZeroClipboard.min.js'
});

function assetTree() {
  return select('bower_components', {
    acceptFiles: [
    	'bootstrap-sass-official/assets/fonts/bootstrap/*',
    	'font-awesome/fonts/*',
    	'zeroclipboard/ZeroClipboard.swf'
    ],
    outputDir: '/assets'
  });
}

function aspnetTree() {
  return select('src/Klondike', {
    acceptFiles: [ '**/*.cs', '**/*.json' ],
    outputDir: '/Klondike'
  });
}

function buildTrees() {
    var trees = [assetTree(), aspnetTree()];
}

var emberAppTree = app.toTree([assetTree()]);
var publicTree = select(emberAppTree, {
  outputDir: '/Klondike/wwwroot'
});

var packTree = exec(mergeTrees([publicTree, aspnetTree()]), {
  command: 'kpm.cmd',
  args: [
    'pack',
    '--no-source',
    '--runtime',
    'KRE-CLR-amd64.1.0.0-alpha4',
    '--out',
    '{destDir}'
  ]
});

packTree.prepare = function(srcDir, destDir) {
  var result = exec.prototype.prepare.apply(this, [srcDir, destDir]);
  return result.then(function(settings) {
    settings.options.cwd = require('path').join(settings.options.cwd, 'Klondike');
    return settings;
  });
}

module.exports = packTree;
