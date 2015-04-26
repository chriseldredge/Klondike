import Ember from 'ember';
import ProgressIndicator from 'klondike/progress-indicator';
import ProgressIndicatorRoute from 'klondike/mixins/progress-indicator-route';
import describePromise from 'klondike/util/describe-promise';

export default Ember.Route.extend(ProgressIndicatorRoute, {
    model: function(params) {
        return this.findModel('package', params.id, params.version);
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        if (!Ember.isEmpty(model.get('versionHistory'))) {
            return;
        }

        var fullModel = this.findModel('package', model.id, model.version);

        if (fullModel.then) {
            ProgressIndicator.start();
            fullModel.then(function(m) {
                model.setProperties(m);
                ProgressIndicator.done();
            }, null, describePromise(this, 'setupController'));
        } else {
            model.setProperties(fullModel);
        }
    }
});
