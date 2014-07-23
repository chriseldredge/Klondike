import Ember from 'ember';
import ProgressIndicator from 'Klondike/progress-indicator';
import ProgressIndicatorRoute from 'Klondike/mixins/progress-indicator-route';

export default Ember.Route.extend(ProgressIndicatorRoute, {
    model: function(params) {
        return this.findModel('package', params.id, params.version);
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        if (Ember.isEmpty(model.versionHistory)) {
            ProgressIndicator.start();
            var fullModel = this.findModel('package', model.id, model.version);
            fullModel.then(function(m) {
                model.setProperties(m);
                ProgressIndicator.done();
            });
        }
    }
});
