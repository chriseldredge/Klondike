define(['require', 'ember', 'restapi', 'signalR'], function (require, em, restapi, signalR) {
    var module = em.Object.extend(em.DeferredMixin).create();
    
    restapi.then(function() {
        var url = restapi.getApi('Indexing.Hub').href;
        var hubUrl = url + '/hubs?noext';
        console.log('loading', hubUrl);
        require([hubUrl], function() {
            for (var i in signalR) {
                var prop = signalR[i];
                if (typeof prop === 'object' && 'hubName' in prop) {
                    module.set(prop.hubName, prop);
                }
            }

            signalR.hub.url = url;
            signalR.hub.logging = true;
            
            module.resolve(module);
        });
    });
    
    return module;
});