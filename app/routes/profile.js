import Ember from 'ember';
import AuthorizedRoute from 'klondike/mixins/authorized-route';
import describePromise from 'klondike/util/describe-promise';

export default Ember.Route.extend(AuthorizedRoute, {
    authorizedApiName: 'users.getAuthenticationInfo',
    model: function () {
        var self = this;
        return this.get('session').then(function() {
            return self.get('session').get('user');
        }, null, describePromise(this, 'model'));
    }
});
