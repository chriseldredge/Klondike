import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    canSynchronizeBinding: Ember.Binding.oneWay('App.packageIndexer.canSynchronize'),

    actions: {
        synchronize: function () {
            App.packageIndexer.synchronize();
        },
        cancel: function () {
            App.packageIndexer.cancel();
        }
    }
});
