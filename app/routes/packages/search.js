import Ember from 'ember';
import ProgressIndicatorRoute from 'klondike/mixins/progress-indicator-route';

export default Ember.Route.extend(ProgressIndicatorRoute, {
  queryParams: {
    query: {
      refreshModel: true
    },
    page: {
      refreshModel: true
    },
    sortBy: {
      refreshModel: true
    },
    sortOrder: {
      refreshModel: true
    },
    includePrerelease: {
      refreshModel: true
    },
    originFilter: {
      refreshModel: true
    },
    latestOnly: {
      refreshModel: true
    }
  },

  model: function (params, transition) {
    var self = this;
    return this.get('packages').search(
      params.query || '',
      params.page || 0,
      /* page size */ undefined,
      params.sortBy,
      params.sortOrder,
      params.includePrerelease,
      params.originFilter,
      params.latestOnly
    ).catch(function(error) {
      if (error && error.status === 400) {
        self.done();
        self.send('invalidSearch', error);
        transition.abort();
        return;
      }
      throw error;
    });
  },

  afterModel: function(results) {
    if (results.get('totalHits') === 1) {
      this.transitionTo('packages.view', results.get('hits')[0]);
    }
  },
});
