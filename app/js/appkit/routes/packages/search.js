import LazyRoute from 'mixins/lazyRoute';

export default Ember.Route.extend(LazyRoute, {
    model: function (params) {
        return App.packages.search(params.query || '');
    }
});
