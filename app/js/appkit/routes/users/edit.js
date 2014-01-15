export default Ember.Route.extend({
    beforeModel: function(transition) {
        return App.session;
    },
    model: function (params) {
        return App.users.find(params.username);
    }
});
