export default Ember.ObjectController.extend({
    errorMessage: '',
    actionLabel: 'Edit',
    isAllowedToDelete: false,

    init: function() {
        this._super();
        this.sessionUserDidChange();
    },

    canDelete: function() {
        return this.get('isAllowedToDelete')
    }.property('isAllowedToDelete'),

    sessionUserDidChange: function() {
        var self = this;
        App.session.isAllowed('users.delete', 'DELETE').then(function(result) {
            self.set('isAllowedToDelete', result);
        });
    }.observes('App.session.user'),

    actions: {
        save: function () {
            var self = this;
            self.set('errorMessage', '');

            var user = {
                username: this.get('username'),
                key: this.get('key'),
                roles: this.get('roles')
            };
            App.users.save(user).then(
                function() {
                    self.transitionToRoute('users.list');
                }, function(err) {
                    self.set('errorMessage', err);
                });
        },
        delete: function() {
            var self = this;
            self.set('errorMessage', '');

            App.users.delete(this.get('username')).then(
                function() {
                    self.transitionToRoute('users.list');
                }, function(err) {
                    self.set('errorMessage', err);
                });

        }
    }
});
