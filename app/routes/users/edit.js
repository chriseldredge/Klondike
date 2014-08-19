import Ember from 'ember';
import ProgressIndicatorRoute from 'Klondike/mixins/progress-indicator-route';
import AuthorizedRoute from 'Klondike/mixins/authorized-route';

export default Ember.Route.extend(ProgressIndicatorRoute, AuthorizedRoute, {
    authorizedApiName: 'users.post'
});
