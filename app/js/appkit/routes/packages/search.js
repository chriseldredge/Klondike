export default Ember.Route.extend({
    model: function (params) {
        return App.packages.search(params.query, 0, 10);
    }
});
