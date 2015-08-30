/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var select = require('broccoli-select');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
  });

  app.import('bower_components/jcaret/jquery.caret.js');
  app.import('bower_components/momentjs/moment.js');
  app.import('bower_components/nprogress/nprogress.js');
  app.import('bower_components/nprogress/nprogress.css');

  app.import({
      development: 'bower_components/jquery-signalr/jquery.signalR.js',
      production: 'bower_components/jquery-signalr/jquery.signalR.min.js'
  });

  function assetTree() {
    return select('bower_components', {
      acceptFiles: [
        'font-awesome/fonts/*'
      ],
      outputDir: '/assets'
    });
  }

  function buildTrees() {
      return [assetTree()];
  }

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree(buildTrees());
};
