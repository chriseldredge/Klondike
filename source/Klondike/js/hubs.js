(function ($, signalR, app) {
    var module = Ember.Object.extend(Ember.DeferredMixin, {
        hubName: ''
    }).create();
    
    app.RestApi.then(function () {
        var url = app.RestApi.getApi('Indexing.Hub').href;
        var hubUrl = url + '/hubs';

        console.log('Loading SignalR hubs from', hubUrl);
        
        $.ajax({
            url: hubUrl,
            dataType: 'script',
            async: false
        });
        
        for (var i in signalR) {
            var prop = signalR[i];
            if (typeof prop === 'object' && 'hubName' in prop) {
                module.set(prop.hubName, prop);
                break;
            }
        }

        signalR.hub.url = url;
        signalR.hub.logging = true;

        module.resolve(module);
    });

    app.Hubs = module;
}(jQuery, jQuery.signalR, window.App));