import Ember from 'ember';
import ProgressIndicator from 'Klondike/progress-indicator';

export default Ember.Mixin.create({
    actions: {
        loading: function() {
            ProgressIndicator.start();
            this.router.one('didTransition', function() {
                ProgressIndicator.done();
            });
        }
    }
});
