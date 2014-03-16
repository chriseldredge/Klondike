import LazyRoute from 'mixins/lazyRoute';
import ProgressIndicator from 'progressIndicator';

export default Ember.Route.extend(LazyRoute, {
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
        else {
            ProgressIndicator.done();
        }
    }
});
