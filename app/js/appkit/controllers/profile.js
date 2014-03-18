import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    pushApiName: 'packages.putPackage',
    pushUriBinding: 'App.restApi.packageSourceUri',
    canPushPackages: false,

    setApiKeyCommand: function() {
        return 'nuget setApiKey ' + this.get('key') + ' -Source ' + this.get('pushUri');
    }.property('pushUri', 'key'),

    setApiKeyCommandWithPrompt: function() {
        return 'C:\> ' + this.get('setApiKeyCommand');
    }.property('setApiKeyCommand'),

    pushPackageCommand: function() {
        return 'nuget push [package.nupkg] -Source ' + this.get('pushUri');
    }.property('pushUri'),

    pushPackageCommandWithPrompt: function() {
        return 'C:\> ' + this.get('pushPackageCommand');
    }.property('pushPackageCommand'),

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
