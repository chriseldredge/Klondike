import Ember from 'ember';
import ProgressIndicatorRoute from 'klondike/mixins/progress-indicator-route';

export default Ember.Route.extend(ProgressIndicatorRoute, {
    beforeModel: function() {
        return this.get('session');
    },
    model: function () {
        return this.get('store').list('user');
    }
});
