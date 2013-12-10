export default Ember.Route.extend({
    model: function (params) {
        return App.users.createModel();
    }
});