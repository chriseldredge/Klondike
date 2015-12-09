import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
    'packages/search': Ember.inject.controller(),
    searchBox: Ember.computed.oneWay('packages/search.query'),

    isLoggedIn: Ember.computed.oneWay('session.isLoggedIn'),
    username: Ember.computed.oneWay('session.username'),
    isSessionInitialized: Ember.computed.oneWay('session.isInitialized'),

    apiURL: Ember.computed.oneWay('restClient.apiURL'),

    productVersion: Ember.computed('application.version', function() {
      return this.get('application.version').split('+')[0];
    }),

    productRevisionHash: Ember.computed('application.version', function() {
      var parts = this.get('application.version').split('+');
      if (parts.length === 2) {
        return parts[1];
      }
      return undefined;
    }),

    actions: {
        search: function () {
            var query = this.get('searchBox');
            var route = Ember.isEmpty(query) ? 'packages.list' : 'packages.search';
            this.transitionToRoute(route, {queryParams: {query: query, page: 0}});
        },
        logIn: function() {
            var self = this;
            this.get('session').tryLogIn().then(function(success) {
                if (!success) {
                    self.transitionToRoute('login');
                }
            });
        },
        logOut: function() {
            this.get('session').logOut();
        }
    }
});
