export default Ember.Route.extend({
    setupController: function(controller, model) {
        controller.set('username', '');
        controller.set('password', '');
        this._super(controller, model);
    }
});
