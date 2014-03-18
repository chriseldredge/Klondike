import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.Controller.extend(BaseControllerMixin, {
    packageSourceCommand: function() {
        return 'nuget sources add -name Klondike -source ' + this.get('packageSourceUri');
    }.property('packageSourceUri'),

    packageSourceCommandWithPrompt: function() {
        return 'C:\> ' + this.get('packageSourceCommand');
    }.property('packageSourceCommand')
});
