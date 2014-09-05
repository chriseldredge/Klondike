import Ember from 'ember';
import ApplicationException from 'Klondike/application-exception';
import signalR from './signalR';
import describePromise from '/klondike/util/describe-promise';

export default Ember.Object.extend({
    _hubs: null,

    init: function() {
        var restClient = this.get('restClient');

        if (!restClient) {
            throw new ApplicationException('Must set restClient property on hub');
        }

        var url;
        var loadHubs = restClient.getApi('Indexing.Hub').then(function (hubApi) {
            url = hubApi.href;
            var hubUrl = url + '/hubs';

            return Ember.$.ajax({
                url: hubUrl,
                dataType: 'script',
                async: false
            }).fail(function(xhr, status) {
              throw new ApplicationException('Failed to load SignalR hubs at ' + hubUrl + ': ' + status + ' (' + xhr.status + ')');
            });
        }, null, describePromise(this, 'init') + ': Load SignalR/hubs.js');

        var resolveHubs = loadHubs.then(function() {
            var hubs = {};

            for (var i in signalR) {
                var prop = signalR[i];
                if (typeof prop === 'object' && 'hubName' in prop) {
                    hubs[prop.hubName] = prop;
                }
            }

            signalR.hub.url = url;

            return hubs;
        }, null, describePromise(this, 'init') + ': Resolve Hubs');

        this.set('_hubs', resolveHubs);
    },

    getHub: function(hubName) {
        return this.get('_hubs').then(function(hubs) {
            var hub = hubs[hubName];

            if (!hub) {
                throw new ApplicationException('No such hub: ' + hubName);
            }

            return hub;
        }, null, describePromise(this, 'getHub', arguments));
    }
});
