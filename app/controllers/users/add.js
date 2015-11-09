import UsersEditController from './edit';

export default UsersEditController.extend({
    actionLabel: 'Create',
    canDelete: false,

    actions: {
        save: function () {
            this.set('errorMessage', '');

            var user = {
                username: this.get('model.username'),
                key: this.get('model.key'),
                roles: this.get('model.roles')
            };

            var promise = this.get('users').add(user);

            return this._wrapAjaxPromise(promise);
        }
    }
});
