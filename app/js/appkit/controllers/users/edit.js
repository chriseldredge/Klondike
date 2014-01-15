import BaseControllerMixin from 'mixins/baseControllerMixin';
import UserPermissionObserver from 'mixins/userPermissionObserver';

export default Ember.ObjectController.extend(BaseControllerMixin, UserPermissionObserver, {
    errorMessage: '',
    actionLabel: 'Edit',
    isAllowedToDelete: false,

    init: function() {
        this._super();
        this.observeUserPermission('isAllowedToDelete', 'users.delete');
    },

    canDelete: function() {
        return this.get('isAllowedToDelete')
    }.property('isAllowedToDelete'),

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
