import Ember from 'ember';
import ProgressIndicatorRoute from 'klondike/mixins/progress-indicator-route';
import AuthorizedRoute from 'klondike/mixins/authorized-route';

export default Ember.Route.extend(ProgressIndicatorRoute, AuthorizedRoute, {
    authorizedApiName: 'users.post'
});
