/* jshint node: true */

module.exports = function(environment) {
  // Here you can point to an external Klondike API provider:
  var app = {
    apiURL: '',
    apiKey: ''
  };

  var ENV = {
    version: require('../package').version,
    modulePrefix: 'klondike',
    environment: environment,
    configuration: 'Debug',
    baseURL: '/',
    locationType: 'history',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    }
  };

  if (app.apiURL === '') {
    var apiURL = ENV.baseURL;
    if (apiURL[apiURL.length-1] !== '/')
    {
      apiURL += '/';
    }
    app.apiURL = apiURL + 'api/';
  } else if (app.apiURL[app.apiURL.length-1] !== '/') {
    app.apiURL += '/';
  }

  var cspExtra = app.apiURL.indexOf('http') === 0 ? ' ' + app.apiURL : '';

  ENV.APP = app;

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'script-src': "'self'" + cspExtra,
    'font-src': "'self'",
    'connect-src': "'self'" + cspExtra + cspExtra.replace('http://', 'ws://'),
    'img-src': "*",
    'style-src': "'self'",
    'object-src': "'self'",
    'media-src': "'self'"
    }

  if (environment === 'development' || environment === 'ember-only') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.contentSecurityPolicy['script-src'] = ENV.contentSecurityPolicy['script-src'] + " 'unsafe-eval'";
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'ember-only') {
    ENV.disableMSBuild = true;
  }

  if (environment === 'production') {
    ENV.configuration = 'Release';
  }

  return ENV;
};
