import ProgressIndicatorRoute from 'mixins/progressIndicatorRoute';

export default Ember.Route.extend(ProgressIndicatorRoute, {
    beforeModel: function(transition) {
        return this.get('session');
    },
    model: function () {
        return this.get('store').list('user');
    }
});
