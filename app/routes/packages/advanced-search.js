import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.get('packages').getAvailableSearchFields();
  },

  actions: {
    invalidSearch: function(error) {
      this.get('controller').send('invalidSearch', error);
      return false;
    }
  }
});
