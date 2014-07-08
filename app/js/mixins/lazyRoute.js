import ProgressIndicator from 'progressIndicator';

export default Ember.Mixin.create({
    loadModel: Ember.K,

    model: function() {
        var result = this.loadModel.apply(this, arguments);

        if (result.then) {
            ProgressIndicator.start();
            result = result.then(function(resolved) {
                ProgressIndicator.done();
                return resolved;
            }, function(err) {
                ProgressIndicator.done();
                throw err;
            });
        }

        return result;
    }
});
