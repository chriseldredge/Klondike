import Ember from 'ember';
import BaseControllerMixin from 'Klondike/mixins/base-controller';

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
