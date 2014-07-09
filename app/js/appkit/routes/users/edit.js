import ProgressIndicatorRoute from 'mixins/progressIndicatorRoute';
import AuthorizedRoute from 'mixins/authorizedRoute';

export default Ember.Route.extend(ProgressIndicatorRoute, AuthorizedRoute, {
    authorizedApiName: 'users.post'
});
