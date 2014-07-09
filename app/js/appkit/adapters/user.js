import User from 'models/user';

export default Ember.Object.extend({
    find: function(name, id) {
        return this.get('restClient').ajax('users.get', { data: { username: id } });
    },

    createModel: function(name, params) {
        return User.create(params || {});
    },

    list: function() {
        var self = this;
        return this.get('restClient').ajax('users.getAllUsers').then(function(json) {
            return json.map(function(user) {
                return self.createModel('user', user);
            });
        });

    }
});
