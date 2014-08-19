import Ember from 'ember';
export default Ember.Route.extend({
    beforeModel: function(transition) {
        this._saveTransition(transition);
    },
    actions: {
        willTransition: function (transition) {
            this._saveTransition(transition);
        }
    },
    _saveTransition: function (transition) {
        if (transition.targetName !== 'login') {
            this.controllerFor('login').set('previousTransition', transition);
        }
    }
});
