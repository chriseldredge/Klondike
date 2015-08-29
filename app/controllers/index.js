import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
  packageSourceCommand: function() {
    return 'nuget sources add -name Klondike -source ' + this.get('packageSourceUri');
  }.property('packageSourceUri')
});
