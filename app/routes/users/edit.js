import Ember from 'ember';
import ProgressIndicatorRoute from 'Klondike/mixins/progress-indicator-route';
import AuthorizedRoute from 'Klondike/mixins/authorizedRoute';

export default Ember.Route.extend(ProgressIndicatorRoute, AuthorizedRoute, {
    authorizedApiName: 'users.post'
});
