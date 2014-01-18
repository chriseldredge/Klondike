import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    pushApiName: 'packages.putPackage',
    pushUri: '',
    canPushPackages: false,

    init: function() {
        this._super();
        this.sessionUserDidChange();
    },

    sessionUserDidChange: function() {
        var self = this;
        App.session.isAllowed(this.get('pushApiName')).then(function(result) {
            self.set('canPushPackages', result);
            App.restApi.getApi(self.get('pushApiName')).then(function(api) {
                self.set('pushUri', api.href);
            });
        });
    }.observes('App.session.user'),

    actions: {
        changeKey: function() {
            App.session.changeKey();
        }
    }
});
