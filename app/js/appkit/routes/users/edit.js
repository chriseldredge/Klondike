import AuthorizedRoute from 'mixins/authorizedRoute';

export default Ember.Route.extend(AuthorizedRoute, {
    authorizedApiName: 'users.put',

    model: function (params) {
        return App.users.find(params.username);
    }
});
