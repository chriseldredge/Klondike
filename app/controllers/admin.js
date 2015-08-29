import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
    canSynchronize: Ember.computed.oneWay('indexer.canSynchronize'),

    actions: {
        rebuild: function () {
            this.get('indexer').rebuild();
        },
        synchronize: function () {
            this.get('indexer').synchronize();
        },
        cancel: function () {
            this.get('indexer').cancel();
        }
    }
});
