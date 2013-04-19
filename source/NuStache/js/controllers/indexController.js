define(['ember', 'restapi'], function (em, restapi) {
    return em.Controller.extend({
        packageSourceUri: 'loading...',
        init: function () {
            var self = this;
            restapi.then(function () {
                var api = restapi.getApi('OData');
                if (!api) {
                    self.set('packageSourceUri', 'unknown');
                    return;
                }

                var href = api.href;
                
                if (href[href.length - 1] !== '/') {
                    href += '/';
                }
                
                self.set('packageSourceUri', href);
            });
        }
    });
});