var signalR = $.signalR;

export default Ember.Deferred.extend({
    restApi: null,

    init: function() {
        var restApi = this.get('restApi');

        if (!restApi) {
            throw 'Must set restApi property on hub';
        }

        var self = this;

        restApi.then(function () {
            var url = restApi.getApi('Indexing.Hub').href;
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

        }, function(error) {
            self.reject('RestApi failed: ' + error);
        });
    },

    getHub: function(hubName) {
        var hubs = this.get('hubs');
        if (!hubs) {
            throw 'Hubs not loaded yet. Did promise complete?';
        }

        var hub = hubs[hubName];

        if (!hub) {
            throw 'No such hub: ' + hubName;
        }

        return hub;
    }
});
