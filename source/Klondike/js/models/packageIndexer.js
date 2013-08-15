define(['ember', 'signalR', 'hubs'], function (em, signalR, hubs) {
    return em.Object.extend({
        restClient: null,
        status: {},
        hub: undefined,
        init: function () {
            hubs.then(this.get('connect').bind(this));
        },
        connect: function() {
            var self = this;
            var setStatusCallback = function (status) {
                self.set('status', status);
            };
            
            var hub = hubs.get('status');
            
            console.log('Connecting to SignalR indexing status hub', signalR.version, signalR.hub.url);
            
            hub.client.updateStatus = setStatusCallback;
            
            hub.connection.stateChanged(function (change) {
                var isConnected = change.newState === signalR.connectionState.connected;
                self.set('isConnected', isConnected);

                if (isConnected) {
                    hub.server.getStatus().done(setStatusCallback);
                } else {
                    setStatusCallback({});
                }
            });
            
            self.set('hub', hub);
            
            signalR.hub.start({ waitForPageLoad: false });
            
        },
        synchronize: function () {
            this.get('restClient').ajax('indexing.synchronize', {
                type: 'POST',
            });
        },
        cancel: function () {
            this.get('restClient').ajax('indexing.cancel', {
                type: 'POST',
            });
        },
        isRunning: function () {
            return this.status.synchronizationState != 'Idle';
        }.property('status'),
    });
});