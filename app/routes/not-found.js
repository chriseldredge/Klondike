import Ember from 'ember';
import ApplicationException from 'Klondike/application-exception';

export default Ember.Route.extend({
  afterModel: function() {
    var ex = new ApplicationException("Invalid Route");
    ex.request = { status: 404 };
    throw ex;
  }
});
