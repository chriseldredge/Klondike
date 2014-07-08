import LazyRoute from 'mixins/lazyRoute';

export default Ember.Route.extend(LazyRoute, {
    queryParams: {
        query: {
            refreshModel: true
        },
        page: {
            refreshModel: true
        },
        sortBy: {
            refreshModel: true
        }
    },

    loadModel: function (params) {
        return App.packages.search(params.query || '', params.page || 0, /* page size */ undefined, params.sortBy);
    },

    afterModel: function(results, transition) {
        if (results.get('totalHits') === 1) {
            this.transitionTo('packages.view', results.get('hits')[0]);
        }
    }
});
