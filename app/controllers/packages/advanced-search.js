import Ember from 'ember';

export default Ember.ObjectController.extend({
  query: '',
  error: null,
  examples: [
    { query: 'Dependencies:Newtonsoft.Json', description: 'Find packages that depend on Newtonsoft.Json' },
    { query: 'Files:Nuget.Core.dll', description: 'Find packages that include Nuget.Core.dll' },
    { query: 'VersionDownloadCount:[1 TO *]', description: 'Find packages that have 1 or more downloads' }
  ],

  errorMessage: function() {
    return this.get('error.response.message');
  }.property('error'),

  actions: {
    search: function () {
      var query = this.get('query');
      var route = Ember.isEmpty(query) ? 'packages.list' : 'packages.search';
      this.set('error', null);
      this.transitionToRoute(route, {queryParams: {query: query, latestOnly:false, page: 0, includePrerelease: true, originFilter: 'any' }});
    },

    selectExample: function(query) {
      this.set('query', query);
    },

    invalidSearch: function(error) {
      this.set('error', error);
    }
  }
});

