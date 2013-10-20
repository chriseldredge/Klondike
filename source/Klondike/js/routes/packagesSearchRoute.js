(function (em, app) {
    app.PackagesSearchRoute = em.Route.extend({
        model: function (params) {
            return App.Packages.search(params.query, 0, 10);
        },
        serialize: function (model) {
            return { query: model.query };
        }
    });
}(Ember, App));