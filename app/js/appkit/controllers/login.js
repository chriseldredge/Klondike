import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.Controller.extend(BaseControllerMixin, {
    username: '',
    password: '',
    errorMessage: '',

    actions: {
        logIn: function () {
            var self = this;
            self.set('errorMessage', '');

            App.session.logIn(this.get('username'), this.get('password')).then(
                function() {
                    var previousTransition = self.get('previousTransition');

                    if (previousTransition) {
                        previousTransition.retry();
                        return;
                    }

                    self.transitionToRoute('index');
                },
                function(error) {
                    self.set('errorMessage', 'Authentication failure (' + error.request.status + ')');
                });
        }
    }
});
