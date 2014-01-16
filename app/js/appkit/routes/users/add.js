import AuthorizedRoute from 'mixins/authorizedRoute';

export default Ember.Route.extend(AuthorizedRoute, {
    authorizedApiName: 'users.put',

    model: function (params) {
        var model = App.users.createModel();
        model.resolve(model);
        return model;
    },

    setupController: function(controller, model) {
        controller.reset();
        this._super(controller, model);
    }
});
