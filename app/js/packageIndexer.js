import UserPermissionObserver from 'mixins/userPermissionObserver';

var signalR = $.signalR;

export default Ember.Object.extend(UserPermissionObserver, {
    restApi: null,
    hubs: null,

    status: {},
    statusHub: null,

    canSynchronize: false,

    init: function () {
        this._super();
        var self = this;

        var hubs = this.get('hubs');
        hubs.then(function() {
            self.set('statusHub', hubs.getHub('status'));
        });

        this.observeUserPermission('canSynchronize', 'indexing.synchronize');
    },

    statusHubDidChange: function() {
        var self = this;
        var setStatusCallback = function (status) {
            self.set('status', status);
        };

        var hub = this.get('statusHub');

        console.log('Connecting to SignalR indexing status hub', signalR.version, signalR.hub.url);

        hub.client.updateStatus = setStatusCallback;

        hub.connection.stateChanged(function (change) {
            var isConnected = change.newState === signalR.connectionState.connected;
            self.set('isConnected', isConnected);

            if (isConnected) {
                hub.server.getStatus().then(setStatusCallback);
            } else {
                setStatusCallback({});
            }
        });

        signalR.hub.start({ waitForPageLoad: false });
    }.observes('statusHub'),

    synchronize: function () {
        this.get('restApi').ajax('indexing.synchronize', {
            type: 'POST',
        });
    },

    cancel: function () {
        this.get('restApi').ajax('indexing.cancel', {
            type: 'POST',
        });
    },

    isRunning: function () {
        return this.status.synchronizationState !== 'Idle';
    }.property('status'),
});
