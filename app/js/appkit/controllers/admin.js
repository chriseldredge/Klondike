import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    actions: {
        synchronize: function () {
            App.packageIndexer.synchronize();
        },
        cancel: function () {
            App.packageIndexer.cancel();
        }
    }
});
