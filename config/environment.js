/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  var hash = '(unknown git revision)';
  try {
    var execSync = require('exec-sync');

    var gitStatus = execSync('git describe --long --abbrev=10 --all --always --dirty');

    var parts = gitStatus.split('-');
    var hash = parts[parts.length-1];

    if (parts[parts.length-1] == 'dirty') {
      hash = parts[parts.length-2] + '-dirty';
    }
  } catch(error) {
    console.error('exec-sync: git describe failed', error);
  }

  ENV.APP.version = require('../package.json').version + ' (' + hash + ')';

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_MODULE_RESOLVER = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'production') {

  }

  return ENV;
};
