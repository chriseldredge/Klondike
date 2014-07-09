import Session from 'session';

export default {
    name: 'inject-store',
    initialize: function(container, app) {
        // restClient
        app.inject('adapter', 'restClient', 'service:rest-client');
        app.inject('session', 'restClient', 'service:rest-client');
        app.inject('service:hubs', 'restClient', 'service:rest-client');
        app.inject('service:package-indexer', 'restClient', 'service:rest-client');
        app.inject('controller', 'restClient', 'service:rest-client');
        app.inject('route', 'restClient', 'service:rest-client');

        // session
        app.register('session:main', Session);
        app.inject('route', 'session', 'session:main');
        app.inject('controller', 'session', 'session:main');
        app.inject('service:package-indexer', 'session', 'session:main');

        // store
        app.inject('route', 'store', 'store:main');
        app.inject('controller', 'store', 'store:main');
        app.inject('session', 'store', 'store:main');

        // hubs
        app.inject('service:package-indexer', 'hubs', 'service:hubs');

        // package-indexer
        app.inject('controller:application', 'indexer', 'service:package-indexer');
        app.inject('controller:admin', 'indexer', 'service:package-indexer');
        app.inject('route:admin', 'indexer', 'service:package-indexer');
    }
};
