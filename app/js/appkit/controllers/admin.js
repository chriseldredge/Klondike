import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    canSynchronizeBinding: Ember.Binding.oneWay('indexer.canSynchronize'),

    actions: {
        synchronize: function () {
            this.get('indexer').synchronize();
        },
        cancel: function () {
            this.get('indexer').cancel();
        }
    }
});
