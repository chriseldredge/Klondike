/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var exec = require('broccoli-exec');
var mergeTrees = require('broccoli-merge-trees');
var select = require('broccoli-select');
var pick = require('broccoli-static-compiler');

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

var emberAppTree = app.toTree([assetTree()]);
var wwwrootTree = pick(emberAppTree, {
  srcDir: '/',
  destDir: '/wwwroot'
});


function aspnetSourceTree() {
  return select('src/Klondike', {
    acceptFiles: [ '**/*', '**/.gitkeep' ],
    outputDir: '/Klondike'
  });
}

var aspnetPackTree = exec(aspnetSourceTree(), {
  command: 'kpm',
  args: [
    'pack',
    '--no-source',
    '--out',
    '{destDir}'
  ]
});

aspnetPackTree.prepare = function(srcDir, destDir) {
  var result = exec.prototype.prepare.apply(this, [srcDir, destDir]);
  return result.then(function(settings) {
    if (process.platform === 'win32') {
      settings.command = 'kpm.cmd';
    }
    settings.options.cwd = require('path').join(settings.options.cwd, 'Klondike');
    return settings;
  });
}

module.exports = mergeTrees([wwwrootTree, aspnetPackTree], {
  overwrite: true
});
