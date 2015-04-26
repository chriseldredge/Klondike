import Ember from 'ember';
import ProgressIndicator from 'klondike/progress-indicator';

export default Ember.Mixin.create({
  start: ProgressIndicator.start,
  done: ProgressIndicator.done,

  actions: {
    loading: function() {
      this.start();
    },

    error: function() {
      this.done();
    },

    didTransition: function() {
      this.done();
    }
  }
});
