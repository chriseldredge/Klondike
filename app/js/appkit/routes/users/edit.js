export default Ember.Route.extend({
    model: function (params) {
        return App.users.find(params.username);
    }
});