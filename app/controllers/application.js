import Ember from 'ember';
import BaseControllerMixin from 'Klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
    needs: 'packages/search',
    searchBoxBinding: Ember.Binding.oneWay('controllers.packages/search.query'),

    isLoggedInBinding: Ember.Binding.oneWay('session.isLoggedIn'),
    usernameBinding: Ember.Binding.oneWay('session.username'),
    isSessionInitializedBinding: Ember.Binding.oneWay('session.isInitialized'),

    apiUrlBinding: Ember.Binding.oneWay('restClient.apiUrl'),

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
