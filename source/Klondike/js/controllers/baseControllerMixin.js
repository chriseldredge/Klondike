(function (em, app) {
    app.BaseControllerMixin = em.Mixin.create({
        _packageSourceUriBinding: 'App.RestClient.packageSourceUri',
        packageSourceUri: function() {
            return this.get('_packageSourceUri') || 'loading...';
        }.property('_packageSourceUri')
    });
}(Ember, App));