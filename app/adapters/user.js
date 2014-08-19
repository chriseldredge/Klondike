import Ember from 'ember';
import User from '../models/user';
import describePromise from '/klondike/util/describe-promise';

export default Ember.Object.extend({
    find: function(id) {
        var self = this;
        var query = this.get('restClient').ajax('users.get', { data: { username: id } });
        return query.then(function(json) {
            return self.createModel(json);
        }, null, describePromise(this, 'find', arguments));
    },

    createModel: function(params) {
        return User.create(params || {});
    },

    list: function() {
        var self = this;
        return this.get('restClient').ajax('users.getAllUsers').then(function(json) {
            return json.map(function(user) {
                return self.createModel(user);
            });
        }, null, describePromise(this, 'list'));
    },

    add: function(user) {
        user.overwrite = false;
        return this._save(user, 'users.put');
    },

    update: function(user) {
        return this._save(user, 'users.post');
    },

    delete: function(username) {
        return this.get('restClient').ajax('users.delete', { data: {username: username} });
    },

    _save: function(user, apiName) {
        var self = this;
        return self.get('restClient').ajax(apiName, { data: user });
    }
});
