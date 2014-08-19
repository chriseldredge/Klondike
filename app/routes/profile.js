import Ember from 'ember';
import AuthorizedRoute from 'Klondike/mixins/authorized-route';

export default Ember.Route.extend(AuthorizedRoute, {
    authorizedApiName: 'users.getAuthenticationInfo',
    model: function () {
        var self = this;
        return this.get('session').then(function() {
            return self.get('session').get('user');
        }, null, 'Route:\'profile\': get user from session');
    }
});
