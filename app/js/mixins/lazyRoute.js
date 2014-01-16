import ProgressIndicator from 'progressIndicator';

export default Ember.Mixin.create({
    beforeModel: function(transition) {
        var providedModel = transition.providedModelsArray.length === 1 ?
            transition.providedModelsArray[0] : null;

        if (providedModel) {
            if (providedModel.then) {
                var modelReady = false;
                providedModel.then(function() {
                    modelReady = true;
                });

                setTimeout(function() {
                    if (!modelReady) {
                        ProgressIndicator.start();
                    }
                }, 200);
            }
        } else {
            ProgressIndicator.start();
        }

        return this._super.apply(this, arguments);
    },
    setupController: function() {
        ProgressIndicator.done();
        return this._super.apply(this, arguments);
    }
});
