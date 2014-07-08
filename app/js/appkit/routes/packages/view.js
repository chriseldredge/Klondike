import ProgressIndicator from 'progressIndicator';
import ProgressIndicatorRoute from 'mixins/progressIndicatorRoute';

export default Ember.Route.extend(ProgressIndicatorRoute, {
    model: function (params) {
        return App.packages.find(params.id, params.version);
    },
    setupController: function(controller, model) {
        this._super(controller, model);

        if (Ember.isEmpty(model.versionHistory)) {
            ProgressIndicator.start();
            var fullModel = App.packages.find(model.id, model.version);
            fullModel.then(function(m) {
                model.setProperties(m);
                ProgressIndicator.done();
            });
        }
    }
});
