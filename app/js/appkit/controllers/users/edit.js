import BaseControllerMixin from 'mixins/baseControllerMixin';
import UserPermissionObserver from 'mixins/userPermissionObserver';
import ProgressIndicator from 'progressIndicator';

export default Ember.ObjectController.extend(BaseControllerMixin, UserPermissionObserver, {
    errorMessage: '',
    originalUsername: '',
    actionLabel: 'Edit',
    isAllowedToDelete: false,
    isSaving: false,
    isSaveCompleted: false,

    modelDidChange: function() {
        this.set('originalUsername', this.get('model.username'));
    }.observes('model'),

    init: function() {
        this._super();
        this.observeUserPermission('isAllowedToDelete', 'users.delete');
    },

    canDelete: function() {
        return this.get('isAllowedToDelete')
    }.property('isAllowedToDelete'),

    isRenamed: function() {
        if (Ember.isEmpty(this.get('originalUsername'))) {
            return false;
        }
        return this.get('originalUsername') !== this.get('username');
    }.property('originalUsername', 'username'),

    reset: function() {
        this.set('errorMessage', '');
        this.set('isSaving', false);
        this.set('isSaveCompleted', false);
    },

    actions: {
        save: function () {
            var self = this;
            this.set('errorMessage', '');

            var user = {
                username: this.get('username'),
                key: this.get('key'),
                roles: this.get('roles')
            };

            var promise = App.users.save(user);

            if (this.get('isRenamed')) {
                promise = promise.then(function() {
                    ProgressIndicator.set(0.5);
                    return App.users.delete(self.get('originalUsername'));
                });
            }

            this._handleResult(promise);
        },
        delete: function() {
            this.set('errorMessage', '');

            var promise = App.users.delete(this.get('originalUsername'));
            this._handleResult(promise);
        },
        cancel: function() {
            this.transitionToRoute('users.list');
        }
    },

    _handleResult: function(promise) {
        ProgressIndicator.start();
        this.set('isSaving', true);

        var self = this;

        var finish = function() {
            self.set('isSaving', false);
            ProgressIndicator.done();
        };

        promise.then(
            function() {
                finish();
                self.set('isSaveCompleted', true);
                self.transitionToRoute('users.list');
            },
            function(err) {
                finish();
                self.set('errorMessage', err);
        });
    }
});
