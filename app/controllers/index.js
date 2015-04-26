import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
  packageSourceName: function() {
    return Ember.$('#package-source-command-placeholder').attr('data-package-source-name');
  }.property(),

  packageSourceCommand: function() {
    return 'nuget sources add -name ' + this.get('packageSourceName') + ' -source ' + this.get('packageSourceUri');
  }.property('packageSourceUri'),

  packageSourceCommandWithPrompt: function() {
    return 'C:\\> ' + this.get('packageSourceCommand');
  }.property('packageSourceCommand')
});
