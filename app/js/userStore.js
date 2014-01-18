import User from 'models/user';

export default Ember.Object.extend({
    restApi: null,

    createModel: function(params) {
        return User.create(params || {});
    },

    list: function () {
        return this.get('restApi').ajax('users.getAllUsers').then(function(json) {
            json.forEach(function(user) {
                user.roles = user.roles || [];
            });
            return json;
        });
    },

    find: function(username) {
        var self = this;

        var request = self.get('restApi').ajax('users.get', { data: { username: username } });

        return request.then(function (json) {
            json.roles = json.roles || [];
            return self.createModel(json);
        });
    },

    add: function(user) {
        user.overwrite = false;
        return this._save(user, 'users.put');
    },

    update: function(user) {
        return this._save(user, 'users.post');
    },

    delete: function(username) {
        return this.get('restApi').ajax('users.delete', { data: {username: username} });
    },

    _save: function(user, apiName) {
        var self = this;
        return self.get('restApi').ajax(apiName, { data: user });
    }
});
