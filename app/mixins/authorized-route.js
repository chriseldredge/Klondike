import Ember from 'ember';

export default Ember.Mixin.create({
    authorizedApiName: '',

    beforeModel: function(transition) {
        if (!this.get('authorizedApiName')) {
            var message = 'must set authorizedApiName property when using AuthorizedRoute mixin';
            console.error(message);
            transition.abort();
            return;
        }

        var self = this;

        var session = this.get('session');
        return session.then(function() {
            if (!session.get('isLoggedIn')) {
                var loginController = self.controllerFor('login');
                loginController.set('previousTransition', transition);
                loginController.set('isRedirected', true);
                transition.abort();
                self.transitionTo('login');
                return;
            }

            return session.isAllowed(self.get('authorizedApiName')).then(function(result) {
                if (!result) {
                    transition.abort();
                    self.transitionTo('denied');
                }
            });
        });
    },

    activate: function() {
        var self = this;
        var session = this.get('session');

        var observer = function() {
            Ember.run.once(function() {
                if (!session.get('isLoggedIn')) {
                    self.transitionTo('index');
                } else {
                    session.isAllowed(self.get('authorizedApiName')).then(function(result) {
                        if (!result) {
                            self.transitionTo('denied');
                        }
                    });
                }
            });
        };

        this.set('_sessionUserObserver', observer);
        session.addObserver('user', observer);
    },

    deactivate: function() {
        var session = this.get('session');
        session.removeObserver('user', this.get('_sessionUserObserver'));
    }
});
