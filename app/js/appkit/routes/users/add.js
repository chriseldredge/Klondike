import UsersEditRoute from 'appkit/routes/users/edit';

export default UsersEditRoute.extend({
    model: function (params) {
        var model = App.users.createModel();
        model.resolve(model);
        return model;
    }
});
