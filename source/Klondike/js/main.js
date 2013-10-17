require.config({
    paths: {
        'jquery': 'vendor/jquery-2.0.3.min',
        'handlebars': 'vendor/handlebars-1.0.0',
        'ember': 'vendor/ember-1.0.0',
        'signalR': 'vendor/jquery.signalR-1.0.1'
    },
    shim: {
        'ember': {
            deps: ['jquery', 'handlebars'],
            init: function ($) {
                console.log('init ember', Ember);
                return Ember;
            }
        },
        'handlebars': {
            init: function ($) {
                console.log('init handlebars', Handlebars);
                return Handlebars;
            }
        },
        'signalR': {
            deps: ['jquery'],
            init: function ($) {
                return $.signalR;
            }
        }
    }
});

require(['router', 'app'], function (router, app) {
    console.log('main require', app, router);
    window.App = app;
});
