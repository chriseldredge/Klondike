export default Ember.Deferred.extend({
    restApi: null,
    users: null,

    user: null,
    usernameBinding: 'user.username',
    keyBinding: 'user.key',

    isLoggedIn: function () {
        return !Ember.isEmpty(this.get('username'));
    }.property('username'),

    init: function () {
        this._invokeLogin('users.getAuthenticationInfo', this);
    },
    
    logIn: function() {
        var result = Ember.Deferred.create();
        this._invokeLogin('users.getRequiredAuthenticationInfo', result);
        return result;
    },
    
    _invokeLogin: function (apiName, result) {
        var self = this;
        var user = this.get('users').createModel();
        this.get('restApi').then(function (restApi) {
            var call = restApi.ajax(apiName, {
                success: function (json) {
                    json = json || {};
                    json.roles = Ember.A(json.roles || []);
                    user.setProperties(json);
                    user.resolve(user);
                    self.set('user', user);
                    result.resolve(self);
                }
            }).fail(function(xhr, statusText) {
                user.reject(statusText + " (" + xhr.status + ")");
                result.reject(statusText + " (" + xhr.status + ")");
            });
        });

    }
});