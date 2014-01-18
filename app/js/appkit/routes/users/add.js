import AuthorizedRoute from 'mixins/authorizedRoute';

export default Ember.Route.extend(AuthorizedRoute, {
    authorizedApiName: 'users.put',

    model: function (params) {
        return App.users.createModel();
    },

    setupController: function(controller, model) {
        controller.reset();
        this._super(controller, model);
    }
});
