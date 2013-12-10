export default Ember.Mixin.create({
    _packageSourceUriBinding: 'App.restApi.packageSourceUri',
    packageSourceUri: function() {
        return this.get('_packageSourceUri') || 'loading...';
    }.property('_packageSourceUri')
});
