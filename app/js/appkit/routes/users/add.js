export default Ember.Route.extend({
    model: function (params) {
        var model = App.users.createModel();
        model.resolve(model);
        return model;
    }
});
