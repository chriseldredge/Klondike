define(['ember'], function (em) {
    return em.ObjectController.extend({
        synchronize: function () {
            App.PackageIndexer.synchronize();
        },
        cancel: function () {
            App.PackageIndexer.cancel();
        }
    });
});