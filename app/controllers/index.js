import Ember from 'ember';
import BaseControllerMixin from 'Klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
    packageSourceCommand: function() {
        return 'nuget sources add -name Klondike -source ' + this.get('packageSourceUri');
    }.property('packageSourceUri'),

    packageSourceCommandWithPrompt: function() {
        return 'C:\\> ' + this.get('packageSourceCommand');
    }.property('packageSourceCommand')
});
