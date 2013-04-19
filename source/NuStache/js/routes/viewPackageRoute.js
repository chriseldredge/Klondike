define(['ember'], function (em) {
    return em.Route.extend({
        setupController: function (controller, params) {
            controller.set('id', params.id);
            controller.set('version', params.version);
        },
        serialize: function (model) {
            return { id: model.id, version: model.version };
        },
    });
});