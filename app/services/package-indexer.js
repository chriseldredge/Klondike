import Ember from 'ember';
import UserPermissionObserver from 'klondike/mixins/user-permission-observer';
import signalR from './signalR';
import describePromise from 'klondike/util/describe-promise';

export default Ember.Object.extend(UserPermissionObserver, {
    hubs: null,

    status: {},
    statusHub: null,

    canSynchronize: false,

    init: function () {
        this._super();
        var self = this;

        this.get('hubs').getHub('status').then(function(statusHub) {
            self.set('statusHub', statusHub);
        }, null, describePromise(this, 'init'));

        this.observeUserPermission('canSynchronize', 'indexing.synchronize');
    },

    statusHubDidChange: function() {
        var self = this;
        var setStatusCallback = function (status) {
            self.set('status', status);
        };

        var hub = this.get('statusHub');

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

    rebuild: function () {
        this.get('restClient').ajax('indexing.synchronize', { data: { mode: 'complete' } });
    },

    synchronize: function () {
        this.get('restClient').ajax('indexing.synchronize');
    },

    cancel: function () {
        this.get('restClient').ajax('indexing.cancel');
    },

    isRunning: function () {
        return this.status.synchronizationState !== 'Idle';
    }.property('status'),
});
