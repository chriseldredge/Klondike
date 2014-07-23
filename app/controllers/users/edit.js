import Ember from 'ember';
import BaseControllerMixin from 'Klondike/mixins/base-controller';
import UserPermissionObserver from 'Klondike/mixins/user-permission-observer';
import ProgressIndicator from 'Klondike/progress-indicator';

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
        return this.get('isAllowedToDelete');
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
            this.set('errorMessage', '');

            var user = {
                username: this.get('username'),
                key: this.get('key'),
                roles: this.get('roles')
            };

            if (this.get('isRenamed')) {
                user.renameTo = user.username;
                user.username = this.get('originalUsername');
                user.overwrite = false;
            }

            var promise = this.get('users').update(user);

            return this._wrapAjaxPromise(promise);
        },
        delete: function() {
            this.set('errorMessage', '');

            var promise = this.get('users').delete(this.get('originalUsername'));
            return this._wrapAjaxPromise(promise);
        },
        cancel: function() {
            this.transitionToRoute('users.list');
        }
    },

    _wrapAjaxPromise: function(promise) {
        ProgressIndicator.start();
        this.set('isSaving', true);

        var self = this;

        var finish = function() {
            self.set('isSaving', false);
            ProgressIndicator.done();
        };

        return promise.then(function() {
            finish();
            self.set('isSaveCompleted', true);
            self.transitionToRoute('users.list');
        }).catch(function(err) {
            finish();
            if (err.request && err.request.status === 409) {
                self.set('errorMessage', 'The account ' + self.get('username') + ' already exists.');
            } else {
                self.set('errorMessage', err.textStatus + '(' + err.errorThrown + ')');
            }
        });
    }
});
