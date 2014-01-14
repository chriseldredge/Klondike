import BaseControllerMixin from 'mixins/baseControllerMixin';

export default Ember.Controller.extend(BaseControllerMixin, {
    canEdit: false,

    init: function() {
        this._super();
        this.sessionUserDidChange();
    },

    sessionUserDidChange: function() {
        var self = this;
        App.session.isAllowed('users.put', 'PUT').then(function(result) {
            self.set('canEdit', result);
        });
    }.observes('App.session.user')
});
