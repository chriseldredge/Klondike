import Ember from 'ember';

export default Ember.Mixin.create({
    packageSourceUri: Ember.computed('restClient.packageSourceUri', {
      get: function() {
       return this.get('restClient.packageSourceUri') || 'loading...';
      }
    })
});
