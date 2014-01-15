export default Ember.Route.extend({
    beforeModel: function(transition) {
        return App.session;
    },
    model: function () {
        return App.users.list();
    }
});
