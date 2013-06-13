require.config({
    paths: {
        'handlebars': 'vendor/handlebars-1.0.0-rc.4',
        'ember': 'vendor/ember-1.0.0-rc.5',
        'signalR': 'vendor/jquery.signalR-1.0.1'
    },
    shim: {
        'ember': {
            deps: ['handlebars'],
            exports: 'Ember'
        },
        'signalR': {
            deps: ['jquery'],
            init: function ($) {
                return $.signalR;
            }
        }
    }
});

require(['app', 'router'], function (app) {
    window.App = app;
});