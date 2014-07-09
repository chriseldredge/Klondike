import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.Controller.extend(BaseControllerMixin, {
    username: '',
    password: '',
    errorMessage: '',
    isRedirected: false,

    actions: {
        logIn: function () {
            var self = this;
            self.set('errorMessage', '');

            return this.get('session').logIn(this.get('username'), this.get('password'))
                .then(function() {
                    var previousTransition = self.get('previousTransition');

                    if (previousTransition) {
                        previousTransition.retry();
                        return;
                    }

                    self.transitionToRoute('index');
                })
                .catch(function(error) {
                    self.set('errorMessage', 'Authentication failed.');
                });
        }
    }
});
