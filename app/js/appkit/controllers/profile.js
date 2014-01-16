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
            self.set('pushUri', App.restApi.getApi(self.get('pushApiName')).href);
        });
    }.observes('App.session.user'),

});
