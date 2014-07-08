import ProgressIndicatorRoute from 'mixins/progressIndicatorRoute';

export default Ember.Route.extend(ProgressIndicatorRoute, {
    beforeModel: function(transition) {
        this._super(transition);
        return App.session;
    },
    model: function () {
        return App.users.list();
    }
});
