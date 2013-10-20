(function (em, app) {
    app.AdminRoute = em.Route.extend({
        model: function () {
            return App.PackageIndexer;
        }
    });
}(Ember, App));