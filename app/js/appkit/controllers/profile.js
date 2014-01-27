import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    pushApiName: 'packages.putPackage',
    pushUriBinding: 'App.restApi.packageSourceUri',
    canPushPackages: false,

    init: function() {
        this._super();
        this.sessionUserDidChange();
    },

    sessionUserDidChange: function() {
        var self = this;
        App.session.isAllowed(this.get('pushApiName')).then(function(result) {
            self.set('canPushPackages', result);
        });
    }.observes('App.session.user'),

    actions: {
        changeKey: function() {
            App.session.changeKey();
        }
    }
});
