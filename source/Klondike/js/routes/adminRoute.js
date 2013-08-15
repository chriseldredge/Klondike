define(['ember'], function (em) {
    return em.Route.extend({
        model: function () {
            return App.PackageIndexer;
        }
    });
});