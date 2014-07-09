import AuthorizedRoute from 'mixins/authorizedRoute';

export default Ember.Route.extend(AuthorizedRoute, {
    authorizedApiName: 'users.getAuthenticationInfo',
    model: function () {
        return this.get('session');
    }
});
