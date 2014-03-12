export default Ember.Route.extend({
    model: function () {
        return App.restApi.ajax('symbols.getSettings');
    }
});
