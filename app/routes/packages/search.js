import Ember from 'ember';
import ProgressIndicatorRoute from 'Klondike/mixins/progress-indicator-route';

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
        }
    },

    model: function (params) {
        return this.get('packages').search(params.query || '', params.page || 0, /* page size */ undefined, params.sortBy);
    },

    afterModel: function(results) {
        if (results.get('totalHits') === 1) {
            this.transitionTo('packages.view', results.get('hits')[0]);
        }
    }
});
