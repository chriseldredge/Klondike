import ProgressIndicator from 'progressIndicator';

export default Ember.Route.extend({
    activate: function() {
        ProgressIndicator.done();
    }
});