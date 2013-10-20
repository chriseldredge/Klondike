(function (em, app) {
    app.AdminController = em.ObjectController.extend(app.BaseControllerMixin, {
        synchronize: function () {
            App.PackageIndexer.synchronize();
        },
        cancel: function () {
            App.PackageIndexer.cancel();
        }
    });
}(Ember, App));