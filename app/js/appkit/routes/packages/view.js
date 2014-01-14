export default Ember.Route.extend({
    model: function (params) {
        return App.packages.find(params.id, params.version);
    },
    setupController: function(controller, model) {
        if (Ember.isEmpty(model.versionHistory)) {
            var fullModel = App.packages.find(model.id, model.version);
            fullModel.then(function(m) {
                model.setProperties(m);
            });
        }
        controller.set('content', model);
    }
});
