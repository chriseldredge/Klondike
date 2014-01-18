import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.Controller.extend(BaseControllerMixin, {
    needs: 'packages/search',
    searchBoxBinding: Ember.Binding.oneWay('controllers.packages/search.query'),

    isLoggedInBinding: Ember.Binding.oneWay('App.session.isLoggedIn'),
    usernameBinding: Ember.Binding.oneWay('App.session.username'),
    isSessionInitializedBinding: Ember.Binding.oneWay('App.session.isInitialized'),

    apiUrlBinding: Ember.Binding.oneWay('App.restApi.apiUrl'),

    actions: {
        search: function () {
            this.get('controllers.packages/search').goTo(this.get('searchBox'));
        },
        logIn: function() {
            var self = this;
            App.session.tryLogIn().then(function(success) {
                if (!success) {
                    self.transitionToRoute('login');
                }
            });
        },
        logOut: function() {
            App.session.logOut();
        }
    }
});
