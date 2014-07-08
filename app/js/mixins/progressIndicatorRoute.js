import ProgressIndicator from 'progressIndicator';

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
