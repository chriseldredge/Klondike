import ApplicationException from 'applicationException';

var signalR = $.signalR;

export default Ember.Deferred.extend({
    init: function() {
        var restClient = this.get('restClient');

        if (!restClient) {
            throw new ApplicationException('Must set restClient property on hub');
        }

        var self = this;

        restClient.getApi('Indexing.Hub').then(function (hubApi) {
            var url = hubApi.href;
            var hubUrl = url + '/hubs';

            console.log('Loading SignalR hubs from', hubUrl);

            $.ajax({
                url: hubUrl,
                dataType: 'script',
                async: false
            }).fail(function(xhr, status) {
                self.reject('Failed to load SignalR hubs: ' + status + ' (' + xhr.status + ')');
            }).done(function() {
                var hubs = {};

                for (var i in signalR) {
                    var prop = signalR[i];
                    if (typeof prop === 'object' && 'hubName' in prop) {
                        hubs[prop.hubName] = prop;
                    }
                }

                self.set('hubs', hubs);

                signalR.hub.url = url;
                //signalR.hub.logging = true;

                self.resolve(self);
            });

        }).catch(function(error) {
            self.reject('restClient failed: ' + error);
        });
    },

    getHub: function(hubName) {
        var hubs = this.get('hubs');
        if (!hubs) {
            throw new ApplicationException('Hubs not loaded yet. Did promise complete?');
        }

        var hub = hubs[hubName];

        if (!hub) {
            throw new ApplicationException('No such hub: ' + hubName);
        }

        return hub;
    }
});
