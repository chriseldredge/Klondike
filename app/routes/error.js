import Ember from 'ember';
import ProgressIndicator from 'klondike/progress-indicator';

export default Ember.Route.extend({
    activate: function() {
        ProgressIndicator.done();
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        model = model || {};
        if (console && console.error) {
            console.error('Unhandled error:', model.message || model.errorThrown, model.stack);
        }
    }
});
