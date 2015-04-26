import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
    title: 'Error',

    statusCode: function() {
        var model = this.get('model');
        if (model && model.request) {
            return model.request.status || 0;
        }
        return 0;
    }.property('model'),

    message: function() {
      if (this.get('statusCode') === 404) {
        return 'The requested resource was not found.';
      }

      return 'Looks like something went wrong. Check the javascript console for more details.';
    }.property('model')
});
