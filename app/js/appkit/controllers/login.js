import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.Controller.extend(BaseControllerMixin, {
    username: '',
    password: '',
    actions: {
        logIn: function () {
            App.session.logIn(this.get('username'), this.get('password'));
        }
    }
});
