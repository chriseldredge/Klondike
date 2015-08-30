import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
    pushApiName: 'packages.putPackage',
    pushUriBinding: 'restClient.packageSourceUri',
    canPushPackages: false,
    keyHidden: true,

    key: function() {
      return this.get('keyHidden') ? '(hidden)' : this.get('model.key');
    }.property('keyHidden', 'model.key'),

    setApiKeyCommand: function() {
        return 'nuget setApiKey ' + this.get('key') + ' -Source ' + this.get('pushUri');
    }.property('pushUri', 'key'),

    pushPackageCommand: function() {
        return 'nuget push [package.nupkg] -Source ' + this.get('pushUri');
    }.property('pushUri'),

    init: function() {
        this._super();
        this.sessionUserDidChange();
    },

    sessionUserDidChange: Ember.observer('session.user', function() {
        var self = this;
        this.get('session').isAllowed(this.get('pushApiName')).then(function(result) {
            self.set('canPushPackages', result);
        });
    }),

    actions: {
        changeKey: function() {
            this.get('session').changeKey();
        },

        revealKey: function() {
            this.set('keyHidden', false);
        }
    }
});
