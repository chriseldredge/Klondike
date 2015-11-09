import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';
import UserPermissionObserver from 'klondike/mixins/user-permission-observer';
import ProgressIndicator from 'klondike/progress-indicator';

export default Ember.Controller.extend(BaseControllerMixin, UserPermissionObserver, {
    errorMessage: '',
    originalUsername: '',
    actionLabel: 'Edit',
    isAllowedToDelete: false,
    isSaving: false,
    isSaveCompleted: false,

    modelDidChange: Ember.observer('model',function() {
        this.set('originalUsername', this.get('model.username'));
        this.set('isSaving', false);
        this.set('isSaveCompleted', false);
    }),

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
        return this.get('originalUsername') !== this.get('model.username');
    }.property('originalUsername', 'model.username'),

    reset: function() {
        this.set('errorMessage', '');
        this.set('isSaving', false);
        this.set('isSaveCompleted', false);
    },

    actions: {
        save: function () {
            this.set('errorMessage', '');

            var user = {
                username: this.get('model.username'),
                key: this.get('model.key'),
                roles: this.get('model.roles')
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
            var message = 'Unknown error occurred.';

            if (err.response && err.response.message) {
              message = err.response.message;
            }

            self.set('errorMessage', message);
        });
    }
});
