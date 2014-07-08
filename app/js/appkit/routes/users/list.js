import LazyRoute from 'mixins/lazyRoute';

export default Ember.Route.extend(LazyRoute, {
    beforeModel: function(transition) {
        this._super(transition);
        return App.session;
    },
    loadModel: function () {
        return App.users.list();
    }
});
