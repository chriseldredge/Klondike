import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    pushUri: '',
    canPushPackages: false,

    init: function() {
        this._super();
        this.sessionUserDidChange();
    },

    sessionUserDidChange: function() {
        var self = this;
        App.session.isAllowed('users.put', 'PUT').then(function(result) {
            self.set('canPushPackages', result);
            self.set('pushUri', App.restApi.getApi('packages.putPackage', 'PUT').href);
        });
    }.observes('App.session.user'),

});
