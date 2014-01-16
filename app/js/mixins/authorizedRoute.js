export default Ember.Mixin.create({
    sessionBinding: 'App.session',
    authorizedApiName: '',

    beforeModel: function(transition) {
        var self = this;
        return this.get('session').then(function(session) {
            if (!session.get('isLoggedIn')) {
                var loginController = self.controllerFor('login');
                loginController.set('previousTransition', transition);
                loginController.set('isRedirected', true);
                transition.abort();
                self.transitionTo('login');
                return;
            }

            if (Ember.isEmpty(self.get('authorizedApiName'))) {
                throw 'must set authorizedApiName property when using AuthorizedRoute mixin';
            }

            return session.isAllowed(self.get('authorizedApiName')).then(function(result) {
                if (!result) {
                    transition.abort();
                    self.transitionTo('denied');
                }
            });
        });
    },
});
