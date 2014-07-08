import LazyRoute from 'mixins/lazyRoute';

export default Ember.Route.extend(LazyRoute, {
    loadModel: function (params) {
        return App.packages.search(params.query || '');
    },

    afterModel: function(results, transition) {
        if (results.get('totalHits') === 1) {
            this.transitionTo('packages.view', results.get('hits')[0]);
        }
    }
});
