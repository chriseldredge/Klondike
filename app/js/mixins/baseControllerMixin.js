export default Ember.Mixin.create({
    _packageSourceUriBinding: 'restClient.packageSourceUri',
    packageSourceUri: function() {
        return this.get('_packageSourceUri') || 'loading...';
    }.property('_packageSourceUri')
});
