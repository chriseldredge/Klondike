import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.Controller.extend(BaseControllerMixin, {
    title: function() {
        var model = this.get('model');
        return (model || {}).errorThrown || 'Oops';
    }.property('model'),

    statusCode: function() {
        var model = this.get('model');
        if (model && model.request) {
            return model.request.status || 0;
        }
        return 0;
    }.property('model')
});
